import React from "react";
import { Link } from "@inertiajs/react";
import { Restaurant } from "@/types/Restaurant";

interface Props {
    restaurants: Restaurant[];
}

export default function Dashboard({ restaurants }: Props) {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="text-gray-600">
                Welcome to Restify! Manage your restaurants below.
            </p>

            {/* Add Restaurant Button */}
            <Link
                href="/restaurants/create"
                className="px-4 py-2 bg-blue-600 text-white rounded shadow"
            >
                + Add New Restaurant
            </Link>

            {/* Restaurant List */}
            <div className="mt-6 space-y-4">
                {restaurants.length === 0 && (
                    <p className="text-gray-500">You have no restaurants yet.</p>
                )}

                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="border p-4 rounded flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-lg">{restaurant.name}</p>
                            <p className="text-gray-600">{restaurant.address}</p>
                        </div>

                        <div className="space-x-3">
                            <Link
                                href={`/restaurants/${restaurant.id}/edit`}
                                className="text-blue-600"
                            >
                                Edit
                            </Link>

                            <Link
                                href={`/restaurants/${restaurant.id}/editor`}
                                className="text-green-600"
                            >
                                Edit Map
                            </Link>

                            <Link
                                method="delete"
                                as="button"
                                href={`/restaurants/${restaurant.id}`}
                                className="text-red-600"
                            >
                                Delete
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
