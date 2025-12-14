import React from "react";
import { Restaurant } from "@/types/Restaurant";

interface Props {
    restaurant: Restaurant;
}

export default function Editor({ restaurant }: Props) {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">
                Editing Layout for: {restaurant.name}
            </h1>

            <p className="text-gray-600">
                This is the map editor page. Soon you will be able to drag tables,
                add rectangles, and save your restaurant layout.
            </p>

            <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <p className="text-gray-500">
                    Map editor canvas will appear here.
                </p>
            </div>
        </div>
    );
}
