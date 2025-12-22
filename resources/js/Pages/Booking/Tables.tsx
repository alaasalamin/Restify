"use client";

import RestifyLayout from "@/Layouts/RestifyLayout";
import { Stage, Layer, Rect, Text, Circle, Line, Label, Tag } from "react-konva";
import Konva from "konva";
import { useState } from "react";

export default function TablesPage({ date, shift, map, booked, selected }: any) {
    // Safety for arrays
    booked = Array.isArray(booked) ? booked : [];
    selected = Array.isArray(selected) ? selected : [];

    // Local state
    const [selectedTables, setSelectedTables] = useState<string[]>(selected);
    const [toasts, setToasts] = useState<any[]>([]);
    const [hover, setHover] = useState<any | null>(null);

    // Toast system
    const showToast = (message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
    };

    // Select / Deselect table
    const toggleTable = (id: string) => {
        const table = map.tables.find((t: any) => t.id === id);
        if (!table) return;

        setSelectedTables((prev) => {
            let updated = [];

            if (prev.includes(id)) {
                updated = prev.filter((t) => t !== id);
                showToast(`Removed ${table.label}`);
            } else {
                updated = [...prev, id];
                showToast(`Selected ${table.label}`);
            }

            return updated;
        });
    };

    // BACK BUTTON always returns to date page
    const backUrl = `/booking/date`;

    // NEXT BUTTON includes selection
    const nextUrl =
        selectedTables.length > 0
            ? `/booking/customer?date=${encodeURIComponent(date)}&shift=${shift}&tables=${selectedTables.join(",")}`
            : "#";

    return (
        <RestifyLayout>
            {/* FLOATING TOASTS */}
            <div className="fixed top-6 right-6 z-[9999] space-y-3">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow text-sm animate-fadein"
                    >
                        {t.message}
                    </div>
                ))}
            </div>

            {/* MAIN CONTAINER */}
            <div className="w-full max-w-5xl mx-auto px-4 py-10 flex flex-col items-center">

                {/* TOP CONTROLS */}
                <div className="w-full grid grid-cols-3 items-center mb-6">

                    {/* LEFT — BACK */}
                    <div className="flex justify-start">
                        <a
                            href={backUrl}
                            className="
                                px-4 py-2 rounded-lg border border-gray-300
                                bg-gray-100 text-gray-700 hover:bg-gray-200
                                transition text-sm font-medium shadow-sm
                            "
                        >
                            ← Back
                        </a>
                    </div>

                    {/* MIDDLE — TITLE */}
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-semibold mb-1">
                            Select Your Table
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {date} • {shift === "before16" ? "Before 16:00" : "After 16:00"}
                        </p>
                    </div>

                    {/* RIGHT — NEXT */}
                    <div className="flex justify-end">
                        <a
                            href={nextUrl}
                            className={`
                                px-6 py-2 rounded-lg shadow font-semibold transition
                                ${
                                selectedTables.length === 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                            }
                            `}
                        >
                            Continue →
                        </a>
                    </div>
                </div>

                {/* LEGEND */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: "#5A7BA8" }}></span>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                        <span>Available</span>
                    </div>
                </div>

                {/* MAP AREA */}
                <div
                    className="
                        w-full max-w-full
                        overflow-auto bg-white border border-gray-200
                        rounded-xl shadow p-4
                    "
                    style={{ maxHeight: "600px" }}
                >
                    <Stage width={900} height={600}>
                        <Layer>
                            {/* STATIC SHAPES */}
                            {map?.shapes?.map((shape: any) => {
                                if (shape.type === "rect")
                                    return (
                                        <Rect
                                            key={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            width={shape.width}
                                            height={shape.height}
                                            rotation={shape.rotation}
                                            fill="#ccc"
                                            opacity={0.35}
                                            cornerRadius={6}
                                        />
                                    );

                                if (shape.type === "circle")
                                    return (
                                        <Circle
                                            key={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            radius={shape.radius}
                                            fill="#ccc"
                                            opacity={0.35}
                                        />
                                    );

                                if (shape.type === "polygon")
                                    return (
                                        <Line
                                            key={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            points={shape.points}
                                            fill="#ccc"
                                            closed
                                            opacity={0.35}
                                        />
                                    );

                                return null;
                            })}

                            {/* TABLES */}
                            {map?.tables?.map((t: any) => {
                                const isBooked = booked.includes(t.id);
                                const isSelected = selectedTables.includes(t.id);

                                return (
                                    <Rect
                                        key={t.id}
                                        x={t.x}
                                        y={t.y}
                                        width={t.width}
                                        height={t.height}
                                        rotation={t.rotation}
                                        cornerRadius={8}
                                        stroke="gray"
                                        strokeWidth={1}
                                        fill={
                                            isBooked
                                                ? "#F28B82"
                                                : isSelected
                                                    ? "#5A7BA8"
                                                    : "#DDDDDD"
                                        }
                                        onMouseEnter={(e) => {
                                            const pos = e.target.getAbsolutePosition();
                                            setHover({
                                                x: pos.x + t.width + 10,
                                                y: pos.y,
                                                text: isBooked
                                                    ? "This table is already booked"
                                                    : `${t.label}\nCapacity: 10 seats`,
                                                type: isBooked ? "booked" : "available",
                                            });
                                        }}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={(e) => {
                                            if (isBooked) return;
                                            toggleTable(t.id);
                                        }}
                                    />
                                );
                            })}

                            {/* LABELS */}
                            {map?.tables?.map((t: any) => {
                                const isBooked = booked.includes(t.id);
                                const isSelected = selectedTables.includes(t.id);

                                return (
                                    <Text
                                        key={t.id + "-label"}
                                        x={t.x + t.width / 2 - 25}
                                        y={t.y + t.height / 2 - 10}
                                        text={t.label}
                                        fill={isBooked || isSelected ? "white" : "black"}
                                        fontSize={14}
                                        width={50}
                                        align="center"
                                        listening={false}
                                    />
                                );
                            })}

                            {/* TOOLTIP */}
                            {hover && (
                                <Label x={hover.x} y={hover.y}>
                                    <Tag
                                        fill={hover.type === "booked" ? "#D9534F" : "#000"}
                                        cornerRadius={6}
                                        shadowColor="black"
                                        shadowBlur={6}
                                        shadowOffset={{ x: 2, y: 2 }}
                                        shadowOpacity={0.3}
                                    />
                                    <Text
                                        text={hover.text}
                                        fill="white"
                                        fontSize={14}
                                        padding={8}
                                        lineHeight={1.3}
                                    />
                                </Label>
                            )}
                        </Layer>
                    </Stage>
                </div>
            </div>

            {/* Animations */}
            <style>
                {`
                .animate-fadein {
                    animation: fadein 0.25s ease-out forwards;
                }
                @keyframes fadein {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </RestifyLayout>
    );
}
