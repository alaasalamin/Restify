import { useState } from "react";

export type ShapeType = "rect" | "circle" | "polygon";

export default function useShapes() {
    const [shapes, setShapes] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // ADD SHAPE (rect, circle, polygon)
    const addShape = (type: ShapeType = "rect") => {
        setShapes(prev => [
            ...prev,
            {
                id: "shape-" + Date.now(),
                type,
                x: 100,
                y: 100,
                width: 150,
                height: 100,
                radius: 60,           // circle
                points: [0, 0, 120, 0, 60, 80], // polygon
                fill: "#cccccc",
                label: "",
                rotation: 0,
            },
        ]);
    };

    const updateShape = (id: string, data: any) => {
        setShapes(prev =>
            prev.map(s => (s.id === id ? { ...s, ...data } : s))
        );
    };

    const deleteShape = (id: string) => {
        if (!confirm("Delete this shape?")) return;
        setShapes(prev => prev.filter(s => s.id !== id));
        setSelectedId(null);
    };

    const renameShape = (id: string) => {
        const oldName = shapes.find(s => s.id === id)?.label || "";
        const name = prompt("Shape label:", oldName);
        if (name === null) return;
        updateShape(id, { label: name });
    };

    return {
        shapes,
        setShapes,
        selectedId,
        setSelectedId,
        addShape,
        updateShape,
        deleteShape,
        renameShape,
    };
}
