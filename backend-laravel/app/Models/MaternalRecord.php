<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaternalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'mother_name',
        'phone',
        'age',
        'pregnancy_weeks',
        'trimester',
        'next_checkup_date',
        'last_hb_level',
        'risk_level',
        'child_name',
        'child_age_months',
        'next_vaccine_due',
        'vaccine_date',
        'sms_sent',
    ];

    protected $casts = [
        'age' => 'integer',
        'pregnancy_weeks' => 'integer',
        'trimester' => 'integer',
        'child_age_months' => 'integer',
        'next_checkup_date' => 'date',
        'next_vaccine_due' => 'date',
        'vaccine_date' => 'date',
        'sms_sent' => 'boolean',
    ];
}
