<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'booking_id',
        'status',
        'invoice_number',
        'total_netto',
        'total_vat',
        'total_brutto',
        'reference_invoice_id',
    ];

    /*--------------------------------
     | RELATIONSHIPS
     *-------------------------------*/

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function reversedInvoice()
    {
        return $this->belongsTo(Invoice::class, 'reference_invoice_id');
    }

    /*--------------------------------
     | INVOICE NUMBER GENERATION
     *-------------------------------*/

    public static function generateNumber(string $prefix): string
    {
        $year = date('Y');

        // Only count invoices for THIS YEAR
        $count = self::whereYear('created_at', $year)->count() + 1;

        // Example: RE-2025-0001 or DRAFT-2025-0001
        return sprintf("%s-%s-%04d", strtoupper($prefix), $year, $count);
    }

    public function assignDraftNumber()
    {
        if (!$this->invoice_number) {
            $this->invoice_number = self::generateNumber('draft');
            $this->save();
        }
    }

    /*--------------------------------
     | ISSUE (GENERATE FINAL INVOICE)
     *-------------------------------*/

    public function issue()
    {
        if ($this->status !== 'issued') {

            // Only generate a final number IF none exists
            $this->invoice_number = self::generateNumber('re');
            $this->status = 'issued';

            // Update totals before saving
            $this->updateTotals();

            $this->save();
        }
    }

    /*--------------------------------
     | CALCULATE TOTALS
     *-------------------------------*/

    public function updateTotals()
    {
        $this->total_netto  = $this->items->sum('total_netto');
        $this->total_vat    = $this->items->sum('total_vat');
        $this->total_brutto = $this->items->sum('total_brutto');

        $this->save();
    }

    /*--------------------------------
     | REVERSE INVOICE
     *-------------------------------*/

    public function reverseInvoice()
    {
        // Create new reversed invoice
        $reversed = self::create([
            'customer_id'         => $this->customer_id,
            'booking_id'          => $this->booking_id,
            'status'              => 'reversed',
            'reference_invoice_id'=> $this->id,
        ]);

        // Assign a legitimate RE-* number to the reversed invoice
        $reversed->invoice_number = self::generateNumber('re');
        $reversed->save();

        // Duplicate each item with NEGATIVE values
        foreach ($this->items as $item) {
            $reversed->items()->create([
                'name'             => $item->name,
                'quantity'         => $item->quantity * -1,
                'unit_price_netto' => $item->unit_price_netto,
                'vat_rate'         => $item->vat_rate,
                'total_netto'      => $item->total_netto * -1,
                'total_vat'        => $item->total_vat * -1,
                'total_brutto'     => $item->total_brutto * -1,
            ]);
        }

        // Recalculate totals for reversed invoice
        $reversed->updateTotals();

        return $reversed;
    }

}
