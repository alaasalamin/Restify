import React, { useRef, useEffect } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";

export default function TablesLayer({
                                        mode,
                                        tables,
                                        selectedId,
                                        setSelectedId,
                                        renameTable,
                                        deleteTable,
                                        updateTable,
                                    }: any) {

    const transformerRef = useRef<any>(null);

    useEffect(() => {
        if (!selectedId) {
            transformerRef.current?.nodes([]);
            return;
        }
        const stage = transformerRef.current.getStage();
        const node = stage.findOne(`#${selectedId}`);
        if (node) {
            transformerRef.current.nodes([node]);
        }
    }, [selectedId, tables]);

    return (
        <>
            {mode === "tables" &&
                tables.map((t: any) => (
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
                        <Rect width={t.width} height={t.height} fill="lightblue" />
                        <Text
                            text={t.label}
                            width={t.width}
                            height={t.height}
                            align="center"
                            verticalAlign="middle"
                        />
                    </Group>
                ))}

            {selectedId && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled
                    keepRatio={false}
                />
            )}
        </>
    );
}
