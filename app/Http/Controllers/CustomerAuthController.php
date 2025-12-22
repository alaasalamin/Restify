<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerAuthController extends Controller
{
    /**
     * Register a new customer
     */
    public function register(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'required|string|max:50',
            'password' => 'required|min:8',
            'password_confirm' => 'required|same:password',
            'company' => 'nullable|string|max:255',
            'po_number' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:255',
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'] ?? null,
            'po_number' => $validated['po_number'] ?? null,
            'street' => $validated['street'] ?? null,
            'zip' => $validated['zip'] ?? null,
            'city' => $validated['city'] ?? null,
            'password' => $validated['password'],
        ]);



        // login new customer
        session(['customer_id' => $customer->id]);

        return back()->with('success', 'registered');
    }


    /**
     * Customer Login
     */
    public function login(Request $request)
    {
        $request->validate([
            "email"    => "required|email",
            "password" => "required|string|min:3",
        ]);

        $customer = Customer::where("email", $request->email)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return back()->withErrors([
                "email" => "Invalid email or password."
            ]);
        }

        // login success
        session(['customer_id' => $customer->id]);

        return back()->with("success", "logged_in");
    }


    /**
     * Logout
     */
    public function logout()
    {
        session()->forget('customer_id');

        return back()->with('success', 'Logged out');
    }
}
