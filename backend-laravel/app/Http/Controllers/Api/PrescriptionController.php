<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\Patient;
use App\Models\PharmacyItem;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PrescriptionController extends Controller
{
    /**
     * List all prescriptions (filtered by status: pending / dispensed)
     */
    public function index(Request $request)
    {
        $query = Prescription::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $prescriptions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $prescriptions,
        ]);
    }

    /**
     * Doctor writes new e-Prescription
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_ticket' => 'required|string',
            'doctor_name' => 'required|string',
            'medicines' => 'required|array',
            'notes' => 'nullable|string',
        ]);

        $patient = Patient::where('ticket_number', $validated['patient_ticket'])->first();

        $prescriptionNumber = 'RX-' . strtoupper(substr(uniqid(), -6));

        $prescription = Prescription::create([
            'prescription_number' => $prescriptionNumber,
            'patient_id' => $patient ? $patient->id : null,
            'patient_ticket' => $validated['patient_ticket'],
            'patient_name' => $patient ? $patient->full_name : 'Bukaan',
            'doctor_name' => $validated['doctor_name'],
            'medicines' => $validated['medicines'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Warqadda daawada {$prescriptionNumber} waxaa loo diray Farmashiyaha.",
            'data' => $prescription,
        ], 201);
    }

    /**
     * Pharmacist dispenses medications
     */
    public function markDispensed(Request $request, $id)
    {
        $prescription = Prescription::findOrFail($id);

        $validated = $request->validate([
            'dispensed_by' => 'required|string',
        ]);

        $prescription->status = 'dispensed';
        $prescription->dispensed_by = $validated['dispensed_by'];
        $prescription->dispensed_at = Carbon::now();
        $prescription->save();

        // Optionally deduct stock from Pharmacy Items if matching name
        if (is_array($prescription->medicines)) {
            foreach ($prescription->medicines as $med) {
                $medName = is_array($med) ? ($med['name'] ?? '') : (string)$med;
                if (!empty($medName)) {
                    $item = PharmacyItem::where('name', 'LIKE', "%{$medName}%")->first();
                    if ($item && $item->stock > 0) {
                        $item->decrement('stock', 1);
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Dawooyinka bukaanka si rasmi ah ayaa loo bixiyay (Medications dispensed).',
            'data' => $prescription,
        ]);
    }
}
