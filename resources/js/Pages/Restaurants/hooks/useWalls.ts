import { useState } from "react";

const CLOSE_DISTANCE = 15;

export default function useWalls(mode: "tables" | "walls" | "shapes") {
    const [walls, setWalls] = useState<any[]>([]);
    const [currentWall, setCurrentWall] = useState<number[]>([]);
    const [previewPoint, setPreviewPoint] = useState<number[] | null>(null);

    const handleMouseDown = (e: any) => {
        if (mode !== "walls") return;
        if (e.target !== e.target.getStage()) return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
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

    const handleMouseMove = (e: any) => {
        if (mode !== "walls") return;
        if (currentWall.length === 0) return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;

        setPreviewPoint([pos.x, pos.y]);
    };

    return {
        walls,
        setWalls,
        currentWall,
        previewPoint,
        handleMouseDown,
        handleMouseMove,
    };
}
