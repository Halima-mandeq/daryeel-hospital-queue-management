<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticketNumber',
        'fullName',
        'triageLevel',
        'status',
        'registeredAt',
        'age',
        'gender',
        'category',
        'assignedDoctorId',
        'phone',
        'pregnancyWeek',
        'symptoms',
        'vitals',
        'assignedRoomId',
        'estimatedWaitMinutes',
        'doctorNotes',
        'calledAt',
        'completedAt',
    ];

    protected $casts = [
        'age' => 'integer',
        'pregnancyWeek' => 'integer',
        'registeredAt' => 'datetime',
        'calledAt' => 'datetime',
        'completedAt' => 'datetime',
        'estimatedWaitMinutes' => 'integer',
        'vitals' => 'array',
    ];

    /**
     * Relationship to the assigned Doctor (User)
     */
    public function assignedDoctor()
    {
        return $this->belongsTo(User::class, 'assignedDoctorId');
    }

    /**
     * Relationship to Consultation Room
     */
    public function assignedRoom()
    {
        return $this->belongsTo(DoctorRoom::class, 'assignedRoomId', 'room_code');
    }
}
