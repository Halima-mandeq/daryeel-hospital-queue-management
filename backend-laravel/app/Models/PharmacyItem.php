<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'generic_name',
        'category',
        'stock',
        'minimum_threshold',
        'unit',
        'dosage',
        'expiry_date',
        'storage_location',
        'unit_price',
    ];

    protected $casts = [
        'stock' => 'integer',
        'minimum_threshold' => 'integer',
        'unit_price' => 'decimal:2',
        'expiry_date' => 'date',
    ];
}
