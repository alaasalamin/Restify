<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCustomerAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (!session()->has('customer_id')) {
            return redirect('/login'); // or wherever your customer login is
        }

        return $next($request);
    }
}
