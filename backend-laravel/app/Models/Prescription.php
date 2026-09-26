<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_number',
        'patient_id',
        'patient_ticket',
        'patient_name',
        'doctor_name',
        'doctor_room',
        'medicines',
        'notes',
        'status',
        'dispensed_by',
        'dispensed_at',
    ];

    protected $casts = [
        'medicines' => 'array',
        'dispensed_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
