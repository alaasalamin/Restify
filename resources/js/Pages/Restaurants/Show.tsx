import RestaurantMapView from "../Restaurants/RestaurantMapView";
import { Restaurant } from "@/types/Restaurant";
import { Table } from "@/types/Table";

export default function Show({ restaurant }: { restaurant: Restaurant }) {

    const handleTableClick = (table: any) => {
        alert("You clicked table: " + table.label);
    };

    return (
        <div>
            <h1>{restaurant.name}</h1>

            <RestaurantMapView
                mapJson={restaurant.map_json}
                onTableClick={handleTableClick}
            />
        </div>
    );
}
