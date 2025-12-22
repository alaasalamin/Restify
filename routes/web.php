<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use App\Models\Booking;
use App\Models\Restaurant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/booking/date', function () {
    return Inertia::render('Booking/Date');
});
Route::get('/booking/tables', function (\Illuminate\Http\Request $request) {
    $restaurant = Restaurant::first();

    $date  = $request->date;
    $shift = $request->shift;

    // get map JSON (string or array)
    $rawMap = $restaurant->map_json;
    $map = is_string($rawMap) ? json_decode($rawMap, true) : $rawMap;

    // get all booked tables for this date & shift
    $booked = Booking::where('date', $date)
        ->where('shift', $shift)
        ->pluck('tables')  // <-- this is JSON array
        ->flatten()        // turns [["t1","t2"],["t3"]] into ["t1","t2","t3"]
        ->toArray();

    // read selected tables from URL
    $selected = $request->tables
        ? explode(',', $request->tables)
        : [];

    return Inertia::render('Booking/Tables', [
        'date'     => $date,
        'shift'    => $shift,
        'map'      => $map,
        'booked'   => $booked,
        'selected' => $selected,
    ]);
});


Route::post('/customer/register', [CustomerAuthController::class, 'register']);
Route::post('/customer/login', [CustomerAuthController::class, 'login']);
Route::post('/customer/logout', [CustomerAuthController::class, 'logout']);






Route::get("/booking/customer", function (Request $request) {

    $tables = explode(",", $request->tables);

    $restaurant = \App\Models\Restaurant::first();

    // FIX: ensure map_json is always a string before decoding
    $rawMap = is_string($restaurant->map_json)
        ? $restaurant->map_json
        : json_encode($restaurant->map_json);

    $map = json_decode($rawMap ?? "{}", true);

    // Extract labels from map_json
    $labels = [];
    if (!empty($map['tables'])) {
        foreach ($tables as $tId) {
            $found = collect($map['tables'])->firstWhere('id', $tId);
            $labels[] = $found['label'] ?? $tId;
        }
    }

    // Logged-in customer
    $customer = null;
    if (session()->has("customer_id")) {
        $customer = \App\Models\Customer::find(session("customer_id"));
    }

    return inertia("Booking/CustomerPage", [
        "date"        => $request->date,
        "shift"       => $request->shift,
        "tables"      => $tables,
        "tableLabels" => $labels,
        "customer"    => $customer,
    ]);
});

Route::post("/booking/create", [BookingController::class, "store"]);
Route::get("/booking/confirmation", function (Request $request) {
    return inertia("Booking/ConfirmationPage", [
        "id" => $request->id
    ]);
});


//Route::post('/booking/create', [BookingController::class, 'store'])->name('booking.store');


Route::middleware(['auth'])->group(function () {
    Route::get('/restaurants/{restaurant}', function (Restaurant $restaurant) {
        return Inertia::render('Restaurants/Show', [
            'restaurant' => $restaurant
        ]);
    })->name('restaurants.show');
    Route::post('/restaurants/{restaurant}/save-layout', [RestaurantController::class, 'saveLayout'])
        ->name('restaurants.saveLayout');
    Route::get('/restaurants/{restaurant}/editor', [RestaurantController::class, 'editor'])
        ->name('restaurants.editor');
    Route::resource('restaurants', RestaurantController::class);
});


Route::get('/dashboard', function () {
    $restaurants = Restaurant::where('user_id', auth()->id())->get();

    return Inertia::render('Dashboard', [
        'restaurants' => $restaurants,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
