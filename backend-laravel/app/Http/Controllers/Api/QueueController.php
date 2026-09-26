<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\DoctorRoom;
use Illuminate\Http\Request;
use Carbon\Carbon;

class QueueController extends Controller
{
    /**
     * Get Live Queue Board for TV Waiting Room Display
     */
    public function getLiveBoard()
    {
        $nowServing = Patient::where('status', 'called')
            ->orderBy('called_at', 'desc')
            ->take(6)
            ->get();

        $upNext = Patient::where('status', 'waiting')
            ->orderBy('triage_score', 'asc')
            ->orderBy('registered_at', 'asc')
            ->take(10)
            ->get();

        $rooms = DoctorRoom::all();

        $statistics = [
            'totalWaiting' => Patient::where('status', 'waiting')->count(),
            'totalCalled' => Patient::where('status', 'called')->count(),
            'totalCompleted' => Patient::where('status', 'completed')->whereDate('completed_at', Carbon::today())->count(),
            'emergencyCount' => Patient::where('status', 'waiting')->where('triage_level', 'emergency')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'nowServing' => $nowServing,
                'upNext' => $upNext,
                'rooms' => $rooms,
                'statistics' => $statistics,
                'timestamp' => Carbon::now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * Doctor calls the next patient in their queue
     */
    public function callNext(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|string',
            'patient_id' => 'nullable|integer',
        ]);

        $room = DoctorRoom::where('room_code', $validated['room_id'])->first();

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Qolka dhakhtarka lama helin.',
            ], 404);
        }

        // If a specific patient ID is provided, call that patient
        if (!empty($validated['patient_id'])) {
            $patient = Patient::findOrFail($validated['patient_id']);
        } else {
            // Find highest priority patient waiting (emergency first, then maternal/child/routine)
            $patient = Patient::where('status', 'waiting')
                ->where(function($q) use ($room) {
                    $q->where('assigned_room_id', $room->room_code)
                      ->orWhereNull('assigned_room_id');
                })
                ->orderBy('triage_score', 'asc')
                ->orderBy('registered_at', 'asc')
                ->first();
        }

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Majiro bukaan hadda sugaya qolkan (No waiting patients).',
            ], 200);
        }

        // Update previous called patient if needed
        $patient->status = 'called';
        $patient->called_at = Carbon::now();
        $patient->assigned_room_id = $room->room_code;
        $patient->assigned_doctor_name = $room->doctor_name;
        $patient->save();

        // Update Doctor Room
        $room->current_patient_id = $patient->ticket_number;
        $room->is_available = false;
        $room->save();

        return response()->json([
            'success' => true,
            'message' => "Bukaanka {$patient->full_name} ({$patient->ticket_number}) ayaa loogu yeeray {$room->room_name}",
            'patient' => $patient,
            'room' => $room,
        ]);
    }

    /**
     * Complete consultation
     */
    public function completeConsultation(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->status = 'completed';
        $patient->completed_at = Carbon::now();

        if ($request->has('notes')) {
            $patient->doctor_notes = $request->notes;
        }

        $patient->save();

        // Free up the room
        if ($patient->assigned_room_id) {
            $room = DoctorRoom::where('room_code', $patient->assigned_room_id)->first();
            if ($room && $room->current_patient_id === $patient->ticket_number) {
                $room->current_patient_id = null;
                $room->is_available = true;
                $room->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'La-tashiga bukaanka si guul leh ayaa loo soo gabagabeeyay.',
            'data' => $patient,
        ]);
    }
}
