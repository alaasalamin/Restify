"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { router } from "@inertiajs/react";
import { Restaurant } from "@/types/Restaurant";

import CanvasStage from "../Restaurants/CanvasStage";
import TablesLayer from "../Restaurants/TablesLayer";
import WallsLayer from "../Restaurants/WallsLayer";

import useTables from "../Restaurants/hooks/useTables";
import useWalls from "../Restaurants/hooks/useWalls";

import ShapesLayer from "../Restaurants/ShapesLayer";
import useShapes from "../Restaurants/hooks/useShapes";


export default function Editor({ restaurant }: { restaurant: Restaurant }) {
    const stageRef = useRef<any>(null);

    const [mode, setMode] = useState<"tables" | "walls" | "shapes">("tables");
    const [toast, setToast] = useState<string | null>(null);

    // ----- CUSTOM HOOKS -----
    const {
        shapes,
        setShapes,
        addShape,
        updateShape,
        deleteShape,
        renameShape,
        selectedId: selectedShapeId,
        setSelectedId: setSelectedShapeId,
    } = useShapes();

    // const {
    //     shapes,
    //     addShape,
    //     updateShape,
    //     deleteShape,
    //     renameShape,
    //     setShapes,
    // } = useShapes();


    const {
        tables,
        selectedId,
        addTable,
        renameTable,
        deleteTable,
        updateTable,
        setTables,
        setSelectedId
    } = useTables();

    const {
        walls,
        currentWall,
        previewPoint,
        handleMouseDown,
        handleMouseMove,
        setWalls,
    } = useWalls(mode);

    /* ---------------- LOAD MAP ---------------- */
    useEffect(() => {
        if (!restaurant.map_json) return;

        try {
            const parsed = JSON.parse(restaurant.map_json);

            setTables(parsed.tables || []);
            setWalls(parsed.walls || []);
            setShapes(parsed.shapes || []);   //  ⭐ NEW ⭐

        } catch {
            console.error("Invalid map_json");
        }
    }, [restaurant.map_json]);


    /* ---------------- SAVE ---------------- */
    const saveLayout = () => {
        router.post(
            `/restaurants/${restaurant.id}/save-layout`,
            { map_json: JSON.stringify({ tables, walls, shapes }) },
            {
                preserveState: true,
                onSuccess: () => {
                    setToast("Layout saved ✔");
                    setTimeout(() => setToast(null), 2000);
                },
            }
        );
    };

    return (
        <div className="p-6 relative">

            {toast && (
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
                    {toast}
                </div>
            )}

            <div className="flex gap-3 mb-4">
                <button onClick={addTable} className="btn">+ Table</button>
                <button onClick={() => setMode("tables")} className="btn">Tables</button>
                <button onClick={() => setMode("walls")} className="btn">Walls</button>
                <button onClick={() => addShape("rect")} className="btn">+ Rect</button>
                <button onClick={() => addShape("circle")} className="btn">+ Circle</button>
                <button onClick={() => addShape("polygon")} className="btn">+ Polygon</button>
                <button onClick={() => setMode("shapes")} className="btn">Shapes</button>
                <button onClick={saveLayout} className="btn">Save</button>
            </div>

            <CanvasStage
                stageRef={stageRef}
                mode={mode}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                setSelectedShapeId={setSelectedShapeId}
                updateShape={updateShape}
                deleteShape={deleteShape}
                renameShape={renameShape}
            >

                <ShapesLayer
                    mode={mode}
                    shapes={shapes}
                    selectedId={selectedShapeId}
                    setSelectedId={setSelectedShapeId}
                    updateShape={updateShape}
                    deleteShape={deleteShape}
                    renameShape={renameShape}
                />

                <WallsLayer
                    mode={mode}
                    walls={walls}
                    currentWall={currentWall}
                    previewPoint={previewPoint}
                    setWalls={setWalls}
                />

                <TablesLayer
                    mode={mode}
                    tables={tables}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    renameTable={renameTable}
                    deleteTable={deleteTable}
                    updateTable={updateTable}
                />
            </CanvasStage>


        </div>
    );
}
