<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    //
    public function customerPage(Request $request)
    {
        $restaurant = Restaurant::first();
        $rawMap = $restaurant->map_json;

// If already array → no need to decode
        if (is_array($rawMap)) {
            $map = $rawMap;
        }

// If null → fallback
        elseif ($rawMap === null) {
            $map = ['tables' => []];
        }

// If string → decode safely
        else {
            $map = json_decode($rawMap, true);
        }
        return Inertia::render('Booking/CustomerPage', [
            'date' => $request->date,
            'shift' => $request->shift,
            'tables' => explode(',', $request->tables),
            'tableLabels' => collect(explode(',', $request->tables))
                ->map(function ($id) use ($map) {
                    return collect($map['tables'])->firstWhere('id', $id)['label'] ?? $id;
                })
                ->toArray(),
        ]);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "date" => "required",
            "shift" => "required",
            "tables" => "required|array",
            "table_labels" => "required|array",
            "comment" => "nullable|string",
        ]);

        $booking = Booking::create([
            "date" => $validated["date"],
            "shift" => $validated["shift"],
            "tables" => $validated["tables"],
            "table_label" => json_encode($validated["table_labels"]), // ← FIX
            "comment" => $validated["comment"],
            "customer_id" => session("customer_id"),
        ]);

        return redirect("/booking/confirmation?id=" . $booking->id);
    }

}
