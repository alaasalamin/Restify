<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

        // --------------------------------------------------
        // 1. VALIDATE INPUT
        // --------------------------------------------------
        $validated = $request->validate([
            "date"          => "required|date",
            "shift"         => "required|string",
            "tables"        => "required|array",
            "table_labels"  => "required|array",
            "comment"       => "nullable|string",
        ]);

        $customerId = session("customer_id");

        // --------------------------------------------------
        // 2. PREVENT DUPLICATE BOOKINGS
        // --------------------------------------------------
        $normalizedTables = collect($validated['tables'])
            ->sort()
            ->values()
            ->toArray();

        $existingBooking = Booking::where("customer_id", $customerId)
            ->where("date", $validated["date"])
            ->where("shift", $validated["shift"])
            ->get()
            ->first(function ($booking) use ($normalizedTables) {
                return collect($booking->tables)->sort()->values()->toArray() === $normalizedTables;
            });

        if ($existingBooking) {
            return redirect("/booking/confirmation?id=" . $existingBooking->id);
        }

        // --------------------------------------------------
        // 3. CREATE BOOKING
        // --------------------------------------------------
        $booking = Booking::create([
            "date"         => $validated["date"],
            "shift"        => $validated["shift"],
            "tables"       => $normalizedTables,
            "table_label"  => json_encode($validated["table_labels"]),
            "comment"      => $validated["comment"],
            "customer_id"  => $customerId,
            "status"       => "confirmed",
        ]);


        // --------------------------------------------------
        // 4. CREATE DRAFT INVOICE IN RSW (NON-BLOCKING)
        // --------------------------------------------------
        try {
            $response = Http::withHeaders([
                'X-API-KEY' => config('services.rsw.api_key'),
            ])->timeout(3)->post(
                config('services.rsw.url') . '/api/invoices',
                [
                    'external_booking_id'  => $booking->id,
                    'external_customer_id' => $customerId,
                    'items'                => [],
                ]
            );


            if ($response->successful()) {
                $booking->update([
                    'external_invoice_id' => $response->json('invoice_id'),
                    'invoice_status'      => 'draft',
                ]);
            }
            logger()->info('RSW invoice response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

        } catch (\Throwable $e) {
            // IMPORTANT:
            // - Booking must NEVER fail because invoicing failed
            // - Log and continue silently
            logger()->error('RSW invoice creation failed', [
                'booking_id' => $booking->id,
                'error'      => $e->getMessage(),
            ]);
        }

        // --------------------------------------------------
        // 5. REDIRECT TO CONFIRMATION
        // --------------------------------------------------
        return redirect("/booking/confirmation?id=" . $booking->id);
    }



}
