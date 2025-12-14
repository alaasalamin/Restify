<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RestaurantController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a list of restaurants owned by the logged-in user
     */
    public function index()
    {
        $restaurants = Restaurant::where('user_id', Auth::id())->get();

        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants,
        ]);
    }

    public function editor(Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant);

        return Inertia::render('Restaurants/Editor', [
            'restaurant' => $restaurant,
        ]);
    }

    /**
     * Show create form
     */
    public function create()
    {
        return Inertia::render('Restaurants/Create');
    }

    /**
     * Store a new restaurant
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        Restaurant::create([
            'user_id' => Auth::id(),
            'name' => $data['name'],
            'address' => $data['address'],
        ]);

        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant created successfully!');
    }

    /**
     * Show edit form
     */
    public function edit(Restaurant $restaurant)
    {
        // Only allow the owner to edit
        $this->authorize('update', $restaurant);

        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant,
        ]);
    }

    /**
     * Update restaurant
     */
    public function update(Request $request, Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $restaurant->update($data);

        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant updated successfully!');
    }

    /**
     * Delete restaurant
     */
    public function destroy(Restaurant $restaurant)
    {
        $this->authorize('delete', $restaurant);

        $restaurant->delete();

        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant deleted successfully!');
    }
}
