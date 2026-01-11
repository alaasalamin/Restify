<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    //
    protected $fillable = [
        'name',
        'api_key',
        'active',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
