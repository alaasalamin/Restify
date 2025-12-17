import { useState } from "react";

export default function useTables() {
    const [tables, setTables] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

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

    const deleteTable = (id: string) => {
        if (!confirm("Delete this table?")) return;
        setTables((prev) => prev.filter((t) => t.id !== id));
        setSelectedId(null);
    };

    const updateTable = (id: string, data: any) => {
        setTables((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
    };

    return {
        tables,
        setTables,
        selectedId,
        setSelectedId,
        addTable,
        renameTable,
        deleteTable,
        updateTable,
    };
}
