<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'customer_id',
        'date',
        'shift',
        'tables',
        'status',
        'table_label',
        'comment',
        'external_invoice_id',
        'invoice_status',
    ];

    protected $casts = [
        'tables' => 'array',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}

