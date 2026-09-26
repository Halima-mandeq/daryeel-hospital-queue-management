<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaternalRecord;
use Illuminate\Http\Request;

class MaternalController extends Controller
{
    /**
     * List Maternal & Child Records
     */
    public function index()
    {
        $records = MaternalRecord::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $records,
        ]);
    }

    /**
     * Register New Pregnant Mother / Child ANC Record
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mother_name' => 'required|string|max:255',
            'phone' => 'required|string',
            'age' => 'required|integer',
            'pregnancy_weeks' => 'required|integer',
            'trimester' => 'required|integer|between:1,3',
            'next_checkup_date' => 'nullable|date',
            'last_hb_level' => 'nullable|string',
            'risk_level' => 'required|in:safe,caution,high_risk',
            'child_name' => 'nullable|string',
            'child_age_months' => 'nullable|integer',
            'next_vaccine_due' => 'nullable|date',
        ]);

        $record = MaternalRecord::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Diiwaanka hooyada iyo dhallaanka si guul leh ayaa loo keydiyay.',
            'data' => $record,
        ], 201);
    }

    /**
     * Send Vaccine/ANC SMS Reminder Simulation
     */
    public function sendReminder($id)
    {
        $record = MaternalRecord::findOrFail($id);
        $record->sms_sent = true;
        $record->save();

        return response()->json([
            'success' => true,
            'message' => "Fariinta xusuusinta ballanta/tallaalka waxaa loo diray nambarka {$record->phone}.",
            'data' => $record,
        ]);
    }
}
