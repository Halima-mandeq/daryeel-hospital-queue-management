<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\DoctorRoom;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PatientController extends Controller
{
    /**
     * List all active or today's patients
     */
    public function index(Request $request)
    {
        $query = Patient::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('room_id')) {
            $query->where('assigned_room_id', $request->room_id);
        }

        if ($request->has('triage_level')) {
            $query->where('triage_level', $request->triage_level);
        }

        $patients = $query->orderBy('triage_score', 'asc')
                          ->orderBy('registered_at', 'asc')
                          ->get();

        return response()->json([
            'success' => true,
            'count' => $patients->count(),
            'data' => $patients,
        ]);
    }

    /**
     * Register New Patient via Triage Intake or Reception
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'age' => 'required|integer|min:0|max:120',
            'gender' => 'required|in:female,male',
            'category' => 'required|in:maternal,child,adult,emergency',
            'pregnancyWeek' => 'nullable|integer',
            'symptoms' => 'nullable|string',
            'triageLevel' => 'nullable|in:emergency,urgent,routine',
            'vitals' => 'nullable|array',
            'assignedRoomId' => 'nullable|string',
        ]);

        $category = $validated['category'];
        $triageLevel = $validated['triageLevel'] ?? ($category === 'emergency' ? 'emergency' : 'routine');

        // Determine Triage Score (1=Emergency, 2=Urgent, 3=Routine)
        $triageScore = match ($triageLevel) {
            'emergency' => 1,
            'urgent' => 2,
            default => 3,
        };

        // Generate Ticket Prefix & Next Number
        $prefix = match ($category) {
            'emergency' => 'E',
            'maternal' => 'M',
            'child' => 'P',
            default => 'R',
        };

        $latestCount = Patient::where('ticket_number', 'LIKE', "{$prefix}-%")->count();
        $nextNumber = str_pad($latestCount + 1, 2, '0', STR_PAD_LEFT);
        $ticketNumber = "{$prefix}-{$nextNumber}";

        // Calculate Estimated Wait Time based on queue depth
        $queueAhead = Patient::whereIn('status', ['waiting', 'called'])
            ->where('triage_score', '<=', $triageScore)
            ->count();
        $estimatedWaitMinutes = $triageScore === 1 ? 0 : max(5, $queueAhead * 12);

        // Find Assigned Room Doctor Name if room specified
        $assignedDoctorName = null;
        if (!empty($validated['assignedRoomId'])) {
            $room = DoctorRoom::where('room_code', $validated['assignedRoomId'])->first();
            if ($room) {
                $assignedDoctorName = $room->doctor_name;
            }
        }

        $patient = Patient::create([
            'ticket_number' => $ticketNumber,
            'full_name' => $validated['fullName'],
            'phone' => $validated['phone'] ?? '',
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'category' => $category,
            'pregnancy_week' => $validated['pregnancyWeek'] ?? null,
            'symptoms' => $validated['symptoms'] ?? 'No symptoms noted',
            'triage_level' => $triageLevel,
            'triage_score' => $triageScore,
            'vitals' => $validated['vitals'] ?? [
                'temperature' => 36.8,
                'bloodPressure' => '120/80',
                'heartRate' => 76,
                'spO2' => 98,
            ],
            'status' => 'waiting',
            'assigned_room_id' => $validated['assignedRoomId'] ?? null,
            'assigned_doctor_name' => $assignedDoctorName,
            'registered_at' => Carbon::now(),
            'estimated_wait_minutes' => $estimatedWaitMinutes,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Bukaanka si guul leh ayaa loo diiwaangeliyey. Lambarka Tikidhka: {$ticketNumber}",
            'data' => $patient,
        ], 201);
    }

    /**
     * Search/Lookup Patient by Ticket or Phone
     */
    public function lookup(Request $request)
    {
        $query = trim($request->query('q', ''));

        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'Fadlan geli lambarka tikidhka ama telefoonka.',
            ], 400);
        }

        $patient = Patient::where('ticket_number', 'LIKE', "%{$query}%")
            ->orWhere('phone', 'LIKE', "%{$query}%")
            ->orWhere('full_name', 'LIKE', "%{$query}%")
            ->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => "Lama helin bukaan leh tikidhka ama macluumaadka: {$query}",
            ], 404);
        }

        // Compute live position ahead
        $positionAhead = Patient::whereIn('status', ['waiting', 'called'])
            ->where(function($q) use ($patient) {
                $q->where('triage_score', '<', $patient->triage_score)
                  ->orWhere(function($sub) use ($patient) {
                      $sub->where('triage_score', '=', $patient->triage_score)
                          ->where('registered_at', '<', $patient->registered_at);
                  });
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => $patient,
            'meta' => [
                'positionAhead' => $positionAhead,
                'liveStatus' => $patient->status,
                'doctorRoom' => $patient->assignedRoom ? $patient->assignedRoom->room_name : null,
            ],
        ]);
    }

    /**
     * Entrance QR Kiosk Scanner Endpoint
     */
    public function scanQR(Request $request)
    {
        $validated = $request->validate([
            'qr_payload' => 'required|string',
        ]);

        $payload = trim($validated['qr_payload']);

        // Check if QR payload contains a ticket query param (e.g. ?ticket=M-14) or raw ticket (M-14)
        $ticket = null;
        if (preg_match('/ticket=([A-Za-z0-9\-]+)/', $payload, $matches)) {
            $ticket = strtoupper($matches[1]);
        } elseif (preg_match('/^[EMPRe-mpr]\-?\d{1,4}$/i', $payload)) {
            $ticket = strtoupper($payload);
        } else {
            $ticket = strtoupper($payload);
        }

        $patient = Patient::where('ticket_number', $ticket)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => "QR Code-kani kuma jiro nidaamka ama tikidhka lama helin: {$ticket}",
            ], 404);
        }

        $room = DoctorRoom::where('room_code', $patient->assigned_room_id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Tikidhka si guul leh ayaa loo aqoonsaday (Ticket recognized).',
            'data' => $patient,
            'room' => $room,
            'scanned_at' => Carbon::now()->toIso8601String(),
        ]);
    }

    /**
     * Update Patient Status (e.g., called, in_consultation, completed)
     */
    public function updateStatus(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:waiting,called,in_consultation,completed,referred',
            'assignedRoomId' => 'nullable|string',
            'doctorNotes' => 'nullable|string',
        ]);

        $patient->status = $validated['status'];

        if ($validated['status'] === 'called') {
            $patient->called_at = Carbon::now();
        } elseif ($validated['status'] === 'completed') {
            $patient->completed_at = Carbon::now();
        }

        if (isset($validated['assignedRoomId'])) {
            $patient->assigned_room_id = $validated['assignedRoomId'];
        }

        if (isset($validated['doctorNotes'])) {
            $patient->doctor_notes = $validated['doctorNotes'];
        }

        $patient->save();

        return response()->json([
            'success' => true,
            'message' => "Xaaladda bukaanka waxaa loo beddelay: {$patient->status}",
            'data' => $patient,
        ]);
    }
}
