<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctor_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_code')->unique(); // e.g. "room-1"
            $table->string('room_name');           // e.g. "Qolka 1: Daryeelka Hooyada & Dhallaanka"
            $table->string('doctor_name');         // e.g. "Dr. Faadumo Cali"
            $table->string('title')->nullable();   // e.g. "Agaasimaha Qaybta Hooyada"
            $table->string('specialty');           // e.g. "Maternal & Child Health"
            $table->string('current_patient_id')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_rooms');
    }
};
