import { useForm } from "@inertiajs/react";
import React from "react";
import { Restaurant } from "@/types/Restaurant";

interface Props {
    restaurant: Restaurant;
}

interface FormData {
    name: string;
    address: string;
}

export default function Edit({ restaurant }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: restaurant.name,
        address: restaurant.address ?? "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/restaurants/${restaurant.id}`);
    };

    return (
        <form onSubmit={submit} className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Edit Restaurant</h1>

            <div>
                <label className="block mb-1">Name</label>
                <input
                    className="border p-2 w-full"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && (
                    <p className="text-red-600 text-sm">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block mb-1">Address</label>
                <input
                    className="border p-2 w-full"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                />
                {errors.address && (
                    <p className="text-red-600 text-sm">{errors.address}</p>
                )}
            </div>

            <button
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Update
            </button>
        </form>
    );
}
