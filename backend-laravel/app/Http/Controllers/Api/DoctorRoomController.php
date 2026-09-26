<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorRoom;
use App\Models\User;
use Illuminate\Http\Request;

class DoctorRoomController extends Controller
{
    /**
     * List all Doctor consultation rooms
     */
    public function index()
    {
        $rooms = DoctorRoom::all();
        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }

    /**
     * Add new Doctor / Room (Admin action)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_name' => 'required|string|max:255',
            'doctor_name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'specialty' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:4',
            'phone' => 'nullable|string',
        ]);

        $nextRoomNum = DoctorRoom::count() + 1;
        $roomCode = "room-" . $nextRoomNum;

        $room = DoctorRoom::create([
            'room_code' => $roomCode,
            'room_name' => $validated['room_name'],
            'doctor_name' => $validated['doctor_name'],
            'title' => $validated['title'] ?? 'Dhakhtar Takhasus Leh',
            'specialty' => $validated['specialty'],
            'is_available' => true,
        ]);

        // If email and password provided, create corresponding user account
        if (!empty($validated['email'])) {
            User::create([
                'name' => $validated['doctor_name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password'] ?? 'Dhakhtar123!'),
                'role' => 'doctor',
                'title' => $validated['title'] ?? 'Dhakhtar Takhasus Leh',
                'department' => $validated['specialty'],
                'specialty' => $validated['specialty'],
                'phone' => $validated['phone'] ?? null,
                'assigned_room_id' => $roomCode,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Dhakhtarka iyo qolka {$room->room_name} si guul leh ayaa loo diiwaangeliyey.",
            'data' => $room,
        ], 201);
    }

    /**
     * Toggle Room Availability (Active / Break)
     */
    public function toggleAvailability($id)
    {
        $room = DoctorRoom::where('id', $id)->orWhere('room_code', $id)->firstOrFail();
        $room->is_available = !$room->is_available;
        $room->save();

        return response()->json([
            'success' => true,
            'message' => "Qolka xaaladdiisa waxaa laga dhigay: " . ($room->is_available ? 'Diyaar (Active)' : 'Garanwaay/Nasasho (Inactive)'),
            'data' => $room,
        ]);
    }
}
