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
        Schema::table('customers', function (Blueprint $table) {
            // Add new profile fields
            $table->string('company')->nullable()->after('phone');
            $table->string('po_number')->nullable()->after('company');
            $table->string('street')->nullable()->after('po_number');
            $table->string('zip')->nullable()->after('street');
            $table->string('city')->nullable()->after('zip');

            // Expand password length if needed
            $table->string('password', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'company',
                'po_number',
                'street',
                'zip',
                'city',
            ]);

            // No need to revert password length
        });
    }
};
