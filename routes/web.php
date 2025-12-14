<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use App\Models\Restaurant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
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
