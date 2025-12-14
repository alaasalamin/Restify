<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'address',
        'map_json',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
