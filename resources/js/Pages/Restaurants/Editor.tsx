import React, { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { Restaurant } from "@/types/Restaurant";

interface KonvaTable {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    draggable: boolean;
}

interface Props {
    restaurant: Restaurant;
}

export default function Editor({ restaurant }: Props) {
    const [tables, setTables] = useState<KonvaTable[]>([]);

    // Add new table
    const addTable = () => {
        const newTable: KonvaTable = {
            id: "table-" + Date.now(),
            x: 100,
            y: 100,
            width: 80,
            height: 50,
            fill: "lightblue",
            draggable: true,
        };

        setTables((prev) => [...prev, newTable]);
    };

    // Dragging
    const handleDragMove = (id: string, e: any) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t
            )
        );
    };

    // Delete table (right click)
    const deleteTable = (id: string) => {
        setTables((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="p-6 space-y-4 relative">
            <h1 className="text-2xl font-bold">
                Editing Layout for: {restaurant.name}
            </h1>

            {/* Add Table Button */}
            <button
                onClick={addTable}
                className="inline-block px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 z-20 relative"
            >
                + Add Table
            </button>

            {/* Canvas */}
            <div className="border border-gray-400 bg-gray-100 rounded-lg overflow-hidden mt-4">
                <Stage width={900} height={600}>
                    <Layer>
                        {tables.map((table) => (
                            <Rect
                                key={table.id}
                                {...table}
                                onDragMove={(e) => handleDragMove(table.id, e)}
                                onContextMenu={(e) => {
                                    e.evt.preventDefault();
                                    deleteTable(table.id);
                                }}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}
