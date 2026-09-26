<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * User Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Also allow plain text comparison for pre-seeded test accounts if needed
            if (!$user || $user->password !== $request->password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ama lambarka sirta ah waa qalad (Invalid email or password).',
                ], 401);
            }
        }

        $token = $user->createToken('hospital-api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Waad ku guuleysatay soo galitaanka (Login successful).',
            'token' => $token,
            'user' => [
                'id' => $user->custom_id ?? (string)$user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'title' => $user->title,
                'department' => $user->department,
                'specialty' => $user->specialty,
                'assignedRoomId' => $user->assigned_room_id,
                'patientTicket' => $user->patient_ticket,
                'avatar' => $user->avatar,
            ],
        ]);
    }

    /**
     * Get Current Authenticated User
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Waad ka baxday nidaamka (Logged out successfully).',
        ]);
    }
}
