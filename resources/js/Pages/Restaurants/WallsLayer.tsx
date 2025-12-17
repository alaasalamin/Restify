import React from "react";
import { Line, Circle } from "react-konva";

export default function WallsLayer({
                                       mode,
                                       walls,
                                       currentWall,
                                       previewPoint,
                                       setWalls,
                                   }: any) {
    return (
        <>
            {/* Existing walls */}
            {walls.map((w: any) => (
                <Line
                    key={w.id}
                    points={w.points}
                    stroke="#444"
                    strokeWidth={4}
                    closed
                    draggable={mode === "walls"}
                    onDragEnd={(e) => {
                        const dx = e.target.x();
                        const dy = e.target.y();

                        setWalls((prev: any) =>
                            prev.map((wall: any) =>
                                wall.id === w.id
                                    ? {
                                        ...wall,
                                        points: wall.points.map((p: number, i: number) =>
                                            i % 2 === 0 ? p + dx : p + dy
                                        ),
                                    }
                                    : wall
                            )
                        );

                        e.target.position({ x: 0, y: 0 });
                    }}
                    onContextMenu={(e) => {
                        e.evt.preventDefault();
                        if (confirm("Delete wall?")) {
                            setWalls((prev: any) => prev.filter((x: any) => x.id !== w.id));
                        }
                    }}
                />
            ))}

            {/* Editable wall points */}
            {mode === "walls" &&
                walls.map((w: any) =>
                    w.points.map((_: number, i: number) => {
                        if (i % 2 !== 0) return null;
                        return (
                            <Circle
                                key={`${w.id}-pt-${i}`}
                                x={w.points[i]}
                                y={w.points[i + 1]}
                                radius={6}
                                fill="orange"
                                draggable
                                onDragMove={(e) => {
                                    const nx = e.target.x();
                                    const ny = e.target.y();

                                    setWalls((prev: any) =>
                                        prev.map((wall: any) =>
                                            wall.id === w.id
                                                ? {
                                                    ...wall,
                                                    points: wall.points.map((p: number, idx: number) =>
                                                        idx === i ? nx : idx === i + 1 ? ny : p
                                                    ),
                                                }
                                                : wall
                                        )
                                    );
                                }}
                            />
                        );
                    })
                )}

            {/* Preview of current wall being drawn */}
            {currentWall.length >= 2 && previewPoint && (
                <Line
                    points={[...currentWall, ...previewPoint]}
                    stroke="orange"
                    strokeWidth={3}
                    dash={[6, 4]}
                    listening={false}
                />
            )}
        </>
    );
}
