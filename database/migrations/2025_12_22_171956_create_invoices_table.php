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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');

            // Item details
            $table->string('name'); // e.g., Biermarke, Burger, Steak, etc.
            $table->integer('quantity')->default(1);

            // Netto prices — each item uses netto, vat is applied later
            $table->decimal('unit_price_netto', 10, 2);
            $table->decimal('vat_rate', 4, 2)->default(19.00); // 19% or 7%

            // Calculated totals for this item
            $table->decimal('total_netto', 10, 2);
            $table->decimal('total_vat', 10, 2);
            $table->decimal('total_brutto', 10, 2);

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
