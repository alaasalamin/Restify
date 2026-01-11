<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CustomerProfileController extends Controller
{
    public function profile()
    {
        $customerId = session('customer_id');

        $customer = Customer::find($customerId);

        if (!$customer) {
            abort(403, 'Customer not authenticated');
        }

        return Inertia::render('Customer/Profile', [
            'customer' => $customer,
        ]);
    }

    public function bookings()
    {
        $customerId = session('customer_id');

        $bookings = Booking::where('customer_id', $customerId)
            ->latest()
            ->get();

        return inertia('Customer/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    public function invoices()
    {
        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect('/');
        }

        $response = Http::withHeaders([
            'X-API-KEY' => config('services.rsw.api_key'),
        ])->get(
            config('services.rsw.url') . '/api/customer-invoices',
            [
                'external_customer_id' => $customerId,
            ]
        );

        $invoices = $response->successful()
            ? $response->json()
            : [];

        return inertia('Customer/Invoices', [
            'invoices' => $invoices,
        ]);
    }

}
