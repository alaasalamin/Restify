import React, { useEffect, useRef, useState } from "react";
import {
    Stage,
    Layer,
    Rect,
    Text,
    Line,
    Group,
    Transformer,
} from "react-konva";
import { router } from "@inertiajs/react";
import { Restaurant } from "@/types/Restaurant";

type Mode = "tables" | "walls";

interface Table {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    label: string;
}

interface Wall {
    id: string;
    points: number[];
}

const GRID_SIZE = 20;
const CLOSE_DISTANCE = 15;

export default function Editor({ restaurant }: { restaurant: Restaurant }) {
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    const [mode, setMode] = useState<Mode>("tables");
    const [tables, setTables] = useState<Table[]>([]);
    const [walls, setWalls] = useState<Wall[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // wall drawing
    const [currentWall, setCurrentWall] = useState<number[]>([]);
    const [previewPoint, setPreviewPoint] = useState<number[] | null>(null);

    // toast
    const [toast, setToast] = useState<string | null>(null);

    /* ---------------- LOAD MAP ---------------- */
    useEffect(() => {
        if (!restaurant.map_json) return;

        try {
            const parsed = JSON.parse(restaurant.map_json);

            setTables(
                (parsed.tables || []).map((t: any, i: number) => ({
                    id: t.id,
                    x: t.x,
                    y: t.y,
                    width: t.width,
                    height: t.height,
                    rotation: t.rotation ?? 0,
                    label: t.label ?? `Table ${i + 1}`,
                }))
            );

            setWalls(parsed.walls || []);
        } catch (e) {
            console.error("Invalid map_json");
        }
    }, [restaurant.map_json]);

    /* ---------------- TRANSFORMER ATTACH ---------------- */
    useEffect(() => {
        if (!transformerRef.current || !stageRef.current) return;

        if (!selectedId) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
            return;
        }

        const node = stageRef.current.findOne(`#${selectedId}`);
        if (node) {
            transformerRef.current.nodes([node]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedId, tables]);

    /* ---------------- TABLES ---------------- */
    const addTable = () => {
        setTables((prev) => [
            ...prev,
            {
                id: "table-" + Date.now(),
                x: 200,
                y: 200,
                width: 80,
                height: 50,
                rotation: 0,
                label: `Table ${prev.length + 1}`,
            },
        ]);
    };

    const renameTable = (id: string) => {
        const old = tables.find((t) => t.id === id)?.label || "";
        const name = prompt("Table name:", old);
        if (!name) return;

        setTables((prev) =>
            prev.map((t) => (t.id === id ? { ...t, label: name } : t))
        );
    };

    const updateTable = (id: string, data: Partial<Table>) => {
        setTables((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
    };

    const deleteTable = (id: string) => {
        if (!confirm("Delete this table?")) return;
        setTables((prev) => prev.filter((t) => t.id !== id));
        setSelectedId(null);
    };

    /* ---------------- WALL DRAW ---------------- */
    const handleStageMouseDown = (e: any) => {
        if (mode !== "walls") return;
        if (e.target !== e.target.getStage()) return;

        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (!pos) return;

        if (currentWall.length === 0) {
            setCurrentWall([pos.x, pos.y]);
            return;
        }

        const [sx, sy] = currentWall;
        const dist = Math.hypot(pos.x - sx, pos.y - sy);

        if (dist < CLOSE_DISTANCE && currentWall.length >= 4) {
            setWalls((prev) => [
                ...prev,
                {
                    id: "wall-" + Date.now(),
                    points: [...currentWall, sx, sy],
                },
            ]);
            setCurrentWall([]);
            setPreviewPoint(null);
            return;
        }

        setCurrentWall((prev) => [...prev, pos.x, pos.y]);
    };

    const handleStageMouseMove = (e: any) => {
        if (mode !== "walls") return;
        if (currentWall.length === 0) return;

        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (!pos) return;

        setPreviewPoint([pos.x, pos.y]);
    };

    /* ---------------- SAVE ---------------- */
    const saveLayout = () => {
        router.post(
            `/restaurants/${restaurant.id}/save-layout`,
            { map_json: JSON.stringify({ tables, walls }) },
            {
                preserveState: true,
                onSuccess: () => {
                    setToast("Layout saved ✔");
                    setTimeout(() => setToast(null), 2000);
                },
            }
        );
    };

    /* ---------------- RENDER ---------------- */
    return (
        <div className="p-6 relative">
            {/* TOAST */}
            {toast && (
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
                    {toast}
                </div>
            )}

            <div className="flex gap-3 mb-4">
                <button onClick={addTable} className="px-3 py-1 bg-green-600 text-white rounded">
                    + Table
                </button>
                <button onClick={() => setMode("tables")} className="px-3 py-1 bg-gray-700 text-white rounded">
                    Tables
                </button>
                <button onClick={() => setMode("walls")} className="px-3 py-1 bg-purple-600 text-white rounded">
                    Draw Walls
                </button>
                <button onClick={saveLayout} className="px-3 py-1 bg-blue-600 text-white rounded">
                    Save
                </button>
            </div>

            {/* CANVAS CONTAINER */}
            <div
                className="relative border bg-gray-100 rounded overflow-hidden"
                style={{ width: 900, height: 600 }}
            >
                <Stage
                    width={900}
                    height={600}
                    ref={stageRef}
                    onMouseDown={handleStageMouseDown}
                    onMouseMove={handleStageMouseMove}
                >
                    <Layer>
                        {/* GRID */}
                        {Array.from({ length: 900 / GRID_SIZE }).map((_, i) => (
                            <Line
                                key={`v-${i}`}
                                points={[i * GRID_SIZE, 0, i * GRID_SIZE, 600]}
                                stroke="#e5e5e5"
                                listening={false}
                            />
                        ))}
                        {Array.from({ length: 600 / GRID_SIZE }).map((_, i) => (
                            <Line
                                key={`h-${i}`}
                                points={[0, i * GRID_SIZE, 900, i * GRID_SIZE]}
                                stroke="#e5e5e5"
                                listening={false}
                            />
                        ))}

                        {/* WALLS */}
                        {walls.map((w) => (
                            <Line
                                key={w.id}
                                points={w.points}
                                stroke="#444"
                                strokeWidth={4}
                                closed
                                onContextMenu={(e) => {
                                    e.evt.preventDefault();
                                    if (confirm("Delete wall?")) {
                                        setWalls((prev) =>
                                            prev.filter((x) => x.id !== w.id)
                                        );
                                    }
                                }}
                            />
                        ))}

                        {/* WALL PREVIEW */}
                        {currentWall.length >= 2 && previewPoint && (
                            <Line
                                points={[...currentWall, ...previewPoint]}
                                stroke="orange"
                                strokeWidth={3}
                                dash={[6, 4]}
                                listening={false}
                            />
                        )}

                        {/* TABLES */}
                        {mode === "tables" &&
                            tables.map((t) => (
                                <Group
                                    key={t.id}
                                    id={t.id}
                                    x={t.x}
                                    y={t.y}
                                    rotation={t.rotation}
                                    draggable
                                    onClick={() => setSelectedId(t.id)}
                                    onDblClick={() => renameTable(t.id)}
                                    onContextMenu={(e) => {
                                        e.evt.preventDefault();
                                        deleteTable(t.id);
                                    }}
                                    onDragMove={(e) =>
                                        updateTable(t.id, {
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        })
                                    }
                                    onTransformEnd={(e) => {
                                        const n = e.target;

                                        updateTable(t.id, {
                                            width: t.width * n.scaleX(),
                                            height: t.height * n.scaleY(),
                                            rotation: n.rotation(),
                                        });

                                        n.scaleX(1);
                                        n.scaleY(1);
                                    }}

                                >
                                    <Rect
                                        width={t.width}
                                        height={t.height}
                                        fill="lightblue"
                                    />
                                    <Text
                                        text={t.label}
                                        width={t.width}
                                        height={t.height}
                                        align="center"
                                        verticalAlign="middle"
                                    />
                                </Group>
                            ))}

                        {/* TRANSFORMER */}
                        {selectedId && (
                            <Transformer
                                ref={transformerRef}
                                rotateEnabled
                                keepRatio={false}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}
