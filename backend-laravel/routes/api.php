<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\DoctorRoomController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\PharmacyController;
use App\Http\Controllers\Api\MaternalController;

/*
|--------------------------------------------------------------------------
| Somali Hospital & Queue System API Routes
|--------------------------------------------------------------------------
*/

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'system' => 'Somali Hospital Queue & Clinical API',
        'backend' => 'Laravel 11.x',
        'database' => 'MySQL',
        'server_time' => now()->toIso8601String(),
    ]);
});

// Authentication
Route::post('/auth/login', [AuthController::class, 'login']);

// Public / Patient & Kiosk Endpoints
Route::get('/queue/live-board', [QueueController::class, 'getLiveBoard']);
Route::get('/patients/lookup', [PatientController::class, 'lookup']);
Route::post('/kiosk/scan-qr', [PatientController::class, 'scanQR']);

// Patient Ticket & Intake
Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::patch('/patients/{id}/status', [PatientController::class, 'updateStatus']);

// Consultation Rooms & Queue Management
Route::get('/rooms', [DoctorRoomController::class, 'index']);
Route::post('/rooms', [DoctorRoomController::class, 'store']);
Route::post('/rooms/{id}/toggle', [DoctorRoomController::class, 'toggleAvailability']);
Route::post('/queue/call-next', [QueueController::class, 'callNext']);
Route::post('/queue/complete/{id}', [QueueController::class, 'completeConsultation']);

// e-Prescription & Pharmacy
Route::get('/prescriptions', [PrescriptionController::class, 'index']);
Route::post('/prescriptions', [PrescriptionController::class, 'store']);
Route::post('/prescriptions/{id}/dispense', [PrescriptionController::class, 'markDispensed']);
Route::get('/pharmacy/inventory', [PharmacyController::class, 'index']);
Route::patch('/pharmacy/inventory/{id}', [PharmacyController::class, 'updateStock']);

// Maternal & Child Health Tracker
Route::get('/maternal', [MaternalController::class, 'index']);
Route::post('/maternal', [MaternalController::class, 'store']);
Route::post('/maternal/{id}/remind', [MaternalController::class, 'sendReminder']);

// Protected Authenticated Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
