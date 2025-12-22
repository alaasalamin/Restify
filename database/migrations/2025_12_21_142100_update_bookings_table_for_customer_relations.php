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
        Schema::table('bookings', function (Blueprint $table) {

            // Add customer_id (nullable for old bookings)
            $table->unsignedBigInteger('customer_id')->nullable()->after('restaurant_id');

            // Add tables JSON column (instead of table_id)
            $table->json('tables')->nullable()->after('shift');

            // Add booking status
            $table->string('status')->default('pending')->after('tables');

            // Remove old table_id column
            $table->dropColumn('table_id');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {

            // Reverse everything
            $table->string('table_id')->nullable();

            $table->dropColumn('status');
            $table->dropColumn('tables');
            $table->dropColumn('customer_id');
        });
    }
};
