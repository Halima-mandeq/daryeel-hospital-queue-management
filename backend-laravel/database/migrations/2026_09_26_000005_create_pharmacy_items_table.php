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
        Schema::create('pharmacy_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('generic_name');
            $table->string('category'); // maternal, pediatric, antibiotic, analgesic, etc.
            $table->integer('stock')->default(0);
            $table->integer('minimum_threshold')->default(20);
            $table->string('unit'); // Tablets, Vials, Bottles, Sachets
            $table->string('dosage');
            $table->date('expiry_date');
            $table->string('storage_location')->nullable();
            $table->decimal('unit_price', 8, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_items');
    }
};
