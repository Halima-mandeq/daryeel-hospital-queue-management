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
        Schema::create('maternal_records', function (Blueprint $table) {
            $table->id();
            $table->string('mother_name');
            $table->string('phone');
            $table->integer('age');
            $table->integer('pregnancy_weeks');
            $table->tinyInteger('trimester')->default(1);
            $table->date('next_checkup_date')->nullable();
            $table->string('last_hb_level')->nullable();
            $table->enum('risk_level', ['safe', 'caution', 'high_risk'])->default('safe');
            $table->string('child_name')->nullable();
            $table->integer('child_age_months')->nullable();
            $table->date('next_vaccine_due')->nullable();
            $table->date('vaccine_date')->nullable();
            $table->boolean('sms_sent')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maternal_records');
    }
};
