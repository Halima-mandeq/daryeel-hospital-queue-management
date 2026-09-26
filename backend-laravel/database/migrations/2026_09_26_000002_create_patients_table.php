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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            
            // Ticket identifier for queue management
            $table->string('ticketNumber')->nullable()->unique()->index();
            
            // Required Patient Fields
            $table->string('fullName');
            $table->integer('age');
            $table->enum('gender', ['female', 'male', 'other']);
            $table->enum('category', ['maternal', 'child', 'adult', 'emergency'])->default('adult');
            
            // Clinical Triage & Queue Status
            $table->enum('triageLevel', ['emergency', 'urgent', 'routine'])->default('routine');
            $table->enum('status', ['waiting', 'called', 'in_consultation', 'completed', 'referred'])->default('waiting');
            $table->timestamp('registeredAt')->useCurrent();
            
            // Assigned Doctor (Foreign key reference to users table)
            $table->foreignId('assignedDoctorId')->nullable()->constrained('users')->nullOnDelete();
            
            // Additional Clinical & Contact Details
            $table->string('phone')->nullable();
            $table->integer('pregnancyWeek')->nullable();
            $table->text('symptoms')->nullable();
            $table->json('vitals')->nullable(); // temperature, bloodPressure, heartRate, spO2
            $table->string('assignedRoomId')->nullable();
            $table->integer('estimatedWaitMinutes')->default(15);
            $table->text('doctorNotes')->nullable();
            $table->timestamp('calledAt')->nullable();
            $table->timestamp('completedAt')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
