<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_code',
        'room_name',
        'doctor_name',
        'title',
        'specialty',
        'current_patient_id',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function currentPatient()
    {
        return $this->belongsTo(Patient::class, 'current_patient_id', 'ticket_number');
    }

    public function queuedPatients()
    {
        return $this->hasMany(Patient::class, 'assigned_room_id', 'room_code')
            ->whereIn('status', ['waiting', 'called', 'in_consultation'])
            ->orderBy('triage_score', 'asc')
            ->orderBy('registered_at', 'asc');
    }
}
