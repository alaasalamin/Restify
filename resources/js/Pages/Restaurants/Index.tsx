import { Link } from "@inertiajs/react";
import { Restaurant } from "@/types/Restaurant";

interface Props {
    restaurants: Restaurant[];
}

export default function Index({ restaurants }: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Restaurants</h1>

            <Link
                href="/restaurants/create"
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add New Restaurant
            </Link>

            <div className="mt-6 space-y-3">
                {restaurants.map((r) => (
                    <div
                        key={r.id}
                        className="p-4 border rounded flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{r.name}</p>
                            <p className="text-gray-600">{r.address}</p>
                        </div>

                        <div className="space-x-3">
                            <Link
                                href={`/restaurants/${r.id}/edit`}
                                className="text-blue-600"
                            >
                                Edit
                            </Link>

                            <Link
                                as="button"
                                method="delete"
                                href={`/restaurants/${r.id}`}
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
