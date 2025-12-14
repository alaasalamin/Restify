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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();

            // Who owns this restaurant? (user_id)
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // Basic restaurant info
            $table->string('name');
            $table->string('address')->nullable();

            // This will store the map editor JSON from Konva.js
            $table->longText('map_json')->nullable();

            // Optional: later for advanced features
            // $table->string('phone')->nullable();
            // $table->string('email')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
