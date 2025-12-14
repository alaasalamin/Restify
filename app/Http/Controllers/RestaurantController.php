<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::where('user_id', auth()->id())->get();

        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants,
        ]);
    }

    public function create()
    {
        return Inertia::render('Restaurants/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'address' => 'nullable|string',
        ]);

        $data['user_id'] = auth()->id();

        Restaurant::create($data);

        return redirect()->route('restaurants.index');
    }

    public function edit(Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant);

        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant,
        ]);
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant);

        $data = $request->validate([
            'name' => 'required|string',
            'address' => 'nullable|string',
        ]);

        $restaurant->update($data);

        return redirect()->route('restaurants.index');
    }

    public function destroy(Restaurant $restaurant)
    {
        $this->authorize('delete', $restaurant);

        $restaurant->delete();

        return redirect()->route('restaurants.index');
    }
}
