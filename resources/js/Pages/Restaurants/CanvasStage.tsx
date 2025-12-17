import React from "react";
import { Stage, Layer, Line } from "react-konva";
import ShapesLayer from "./ShapesLayer"; // ⬅️ تأكد من إضافة هذا

const GRID_SIZE = 20;

export default function CanvasStage({
                                        stageRef,
                                        children,
                                        mode,
                                        handleMouseDown,
                                        handleMouseMove,
                                        shapes,
                                        selectedShapeId,
                                        setSelectedShapeId,
                                        updateShape,
                                        deleteShape,
                                        renameShape,
                                    }: any) {
    return (
        <div
            className="relative border bg-gray-200 rounded overflow-hidden"
            style={{ width: 900, height: 600 }}
        >
            <Stage
                width={900}
                height={600}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                {/* 0) BACKGROUND LAYER (future image support) */}
                <Layer listening={false} />

                {/* 1) GRID LAYER */}
                <Layer listening={false}>
                    {Array.from({ length: 900 / GRID_SIZE }).map((_, i) => (
                        <Line
                            key={`v-${i}`}
                            points={[i * GRID_SIZE, 0, i * GRID_SIZE, 600]}
                            stroke="#e0e0e0"
                            strokeWidth={1}
                        />
                    ))}
                    {Array.from({ length: 600 / GRID_SIZE }).map((_, i) => (
                        <Line
                            key={`h-${i}`}
                            points={[0, i * GRID_SIZE, 900, i * GRID_SIZE]}
                            stroke="#e0e0e0"
                            strokeWidth={1}
                        />
                    ))}
                </Layer>

                {/* 2) MAIN CONTENT LAYER */}
                <Layer>

                    {/* SHAPES */}
                    <ShapesLayer
                        mode={mode}
                        shapes={shapes}
                        selectedId={selectedShapeId}
                        setSelectedId={setSelectedShapeId}
                        updateShape={updateShape}
                        deleteShape={deleteShape}
                        renameShape={renameShape}
                    />

                    {/* WALLS + TABLES */}
                    {children}
                </Layer>

                {/* 3) TOP UI LAYER */}
                <Layer listening={false} />
            </Stage>
        </div>
    );
}
