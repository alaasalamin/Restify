<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'name',
        'quantity',
        'unit_price_netto',
        'vat_rate',
        'total_netto',
        'total_vat',
        'total_brutto',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}

