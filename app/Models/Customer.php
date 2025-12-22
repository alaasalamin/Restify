<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'company',
        'po_number',
        'street',
        'zip',
        'city',
    ];

    protected $hidden = [
        'password',
    ];

    // Automatically hash password when saving
    public function setPasswordAttribute($value)
    {
        if ($value && strlen($value) < 60) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
