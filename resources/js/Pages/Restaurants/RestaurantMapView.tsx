"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Line, Circle } from "react-konva";
import { Table } from "@/types/Table";

export default function RestaurantMapView({ mapJson }: { mapJson: string }) {
    const [tables, setTables] = useState<Table[]>([]);
    const [walls, setWalls] = useState<any[]>([]);
    const [shapes, setShapes] = useState<any[]>([]);

    const [hoverId, setHoverId] = useState<string | null>(null);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    /* Toggle Multi-Select */
    const toggleTableSelect = (id: string) => {
        setSelectedTables((prev) =>
            prev.includes(id)
                ? prev.filter((tid) => tid !== id) // unselect
                : [...prev, id] // select
        );
    };

    /* LOAD MAP */
    useEffect(() => {
        if (!mapJson) return;

        try {
            const parsed = JSON.parse(mapJson);

            // If old maps don't have status, default to "free"
            const fixedTables = (parsed.tables || []).map((t: any) => ({
                status: "free",
                ...t,
            }));

            setTables(fixedTables);
            setWalls(parsed.walls || []);
            setShapes(parsed.shapes || []);
        } catch {
            console.error("Invalid map_json");
        }
    }, [mapJson]);

    return (
        <div className="flex gap-6">

            {/* LEFT SIDE — MAP */}
            <div
                className="border bg-gray-100 rounded"
                style={{ width: 900, height: 600 }}
            >
                <Stage width={900} height={600}>

                    {/* SHAPES */}
                    <Layer listening={false}>
                        {shapes.map((shape: any) => (
                            <React.Fragment key={shape.id}>
                                {shape.type === "rect" && (
                                    <Rect
                                        x={shape.x}
                                        y={shape.y}
                                        width={shape.width}
                                        height={shape.height}
                                        rotation={shape.rotation}
                                        fill={shape.fill}
                                        listening={false}
                                    />
                                )}

                                {shape.type === "circle" && (
                                    <Circle
                                        x={shape.x}
                                        y={shape.y}
                                        radius={shape.radius}
                                        rotation={shape.rotation}
                                        fill={shape.fill}
                                        listening={false}
                                    />
                                )}

                                {shape.type === "polygon" && (
                                    <Line
                                        points={shape.points}
                                        x={shape.x}
                                        y={shape.y}
                                        rotation={shape.rotation}
                                        fill={shape.fill}
                                        stroke="#444"
                                        closed
                                        listening={false}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Layer>

                    {/* WALLS */}
                    <Layer listening={false}>
                        {walls.map((w: any) => (
                            <Line
                                key={w.id}
                                points={w.points}
                                stroke="#333"
                                strokeWidth={4}
                                closed
                                listening={false}
                            />
                        ))}
                    </Layer>

                    {/* TABLES (INTERACTIVE + BOOKING LOGIC) */}
                    <Layer>
                        {tables.map((t: Table) => {
                            const isSelected = selectedTables.includes(t.id);
                            const isBooked = t.status === "booked";

                            return (
                                <React.Fragment key={t.id}>
                                    <Rect
                                        x={t.x}
                                        y={t.y}
                                        width={t.width}
                                        height={t.height}
                                        rotation={t.rotation}
                                        cornerRadius={5}

                                        fill={
                                            isBooked
                                                ? "#cc0000" // booked (red)
                                                : isSelected
                                                    ? "#0047AB" // selected
                                                    : hoverId === t.id
                                                        ? "#1E90FF" // hover
                                                        : "#7CBDFF" // default
                                        }

                                        // CLICK only if table is free
                                        onClick={() => {
                                            if (isBooked) return;
                                            toggleTableSelect(t.id);
                                        }}

                                        onTap={() => {
                                            if (isBooked) return;
                                            toggleTableSelect(t.id);
                                        }}

                                        onMouseEnter={() => {
                                            if (isBooked) {
                                                document.body.style.cursor = "not-allowed";
                                                return;
                                            }
                                            document.body.style.cursor = "pointer";
                                            setHoverId(t.id);
                                        }}

                                        onMouseLeave={() => {
                                            document.body.style.cursor = "default";
                                            setHoverId(null);
                                        }}
                                    />

                                    {/* LABEL */}
                                    <Text
                                        text={t.label}
                                        x={t.x}
                                        y={t.y}
                                        width={t.width}
                                        height={t.height}
                                        rotation={t.rotation}
                                        align="center"
                                        verticalAlign="middle"
                                        fill="black"

                                        onClick={() => {
                                            if (isBooked) return;
                                            toggleTableSelect(t.id);
                                        }}

                                        onTap={() => {
                                            if (isBooked) return;
                                            toggleTableSelect(t.id);
                                        }}

                                        onMouseEnter={() => {
                                            if (isBooked) {
                                                document.body.style.cursor = "not-allowed";
                                                return;
                                            }
                                            document.body.style.cursor = "pointer";
                                            setHoverId(t.id);
                                        }}

                                        onMouseLeave={() => {
                                            document.body.style.cursor = "default";
                                            setHoverId(null);
                                        }}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </Layer>
                </Stage>
            </div>

            {/* RIGHT SIDE — Selected Tables */}
            <div className="w-64 bg-white rounded shadow p-4 h-60 overflow-y-auto">
                <h2 className="font-bold text-lg mb-3">Selected Tables</h2>

                {selectedTables.length === 0 && (
                    <p className="text-gray-500">No tables selected</p>
                )}

                {selectedTables.map((id) => {
                    const table = tables.find((t) => t.id === id) as Table | undefined;

                    return (
                        <div key={id} className="p-2 border-b text-sm">
                            {table?.label ?? id}
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
