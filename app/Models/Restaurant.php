<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'address',
        'map_json',
    ];

    protected $casts = [
        'map_json' => 'array',
    ];
}
