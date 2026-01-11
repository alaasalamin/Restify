<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            // Customer + Booking
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('set null');

            // Status: draft → can be modified, issued → final, reversed → negative correction
            $table->enum('status', ['draft', 'issued', 'reversed'])->default('draft');

            // Invoice number is generated only when status becomes "issued"
            $table->string('invoice_number')->nullable()->unique();

            // Totals
            $table->decimal('total_netto', 10, 2)->default(0);
            $table->decimal('total_vat', 10, 2)->default(0);
            $table->decimal('total_brutto', 10, 2)->default(0);

            // For reversal invoices: store which invoice it reverses
            $table->foreignId('reference_invoice_id')->nullable()->constrained('invoices');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
