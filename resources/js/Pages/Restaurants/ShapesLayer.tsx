import React, { useRef, useEffect } from "react";
import { Group, Rect, Circle, Line, Text, Transformer } from "react-konva";

export default function ShapesLayer({
                                        shapes,
                                        selectedId,
                                        setSelectedId,
                                        updateShape,
                                        deleteShape,
                                        renameShape,
                                        mode,
                                    }: any) {
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        if (!selectedId) {
            transformerRef.current?.nodes([]);
            return;
        }

        const stage = transformerRef.current.getStage();
        const node = stage.findOne(`#${selectedId}`);
        if (node) transformerRef.current.nodes([node]);
    }, [selectedId, shapes]);

    return (
        <>
            {shapes.map((shape: any) => (
                <Group
                    key={shape.id}
                    id={shape.id}
                    x={shape.x}
                    y={shape.y}
                    rotation={shape.rotation}
                    draggable={selectedId === shape.id}
                    onClick={() => setSelectedId(shape.id)}
                    onTransformEnd={(e) => {
                        const node = e.target;

                        const newWidth = node.width() * node.scaleX();
                        const newHeight = node.height() * node.scaleY();

                        updateShape(shape.id, {
                            width: newWidth,
                            height: newHeight,
                            rotation: node.rotation(),
                        });

                        node.scaleX(1);
                        node.scaleY(1);
                    }}
                >

                {/* RECTANGLE */}
                    {shape.type === "rect" && (
                        <Rect
                            width={shape.width}
                            height={shape.height}
                            fill={shape.fill}
                            cornerRadius={4}
                        />
                    )}

                    {/* CIRCLE */}
                    {shape.type === "circle" && (
                        <Circle
                            radius={shape.radius}
                            fill={shape.fill}
                        />
                    )}

                    {/* POLYGON */}
                    {shape.type === "polygon" && (
                        <Line
                            points={shape.points}
                            fill={shape.fill}
                            stroke="#444"
                            strokeWidth={2}
                            closed
                        />
                    )}

                    {shape.label && (
                        <Text
                            text={shape.label}
                            width={shape.width}
                            height={shape.height}
                            align="center"
                            verticalAlign="middle"
                        />
                    )}
                </Group>
            ))}

            {selectedId && (
                <Transformer ref={transformerRef} rotateEnabled keepRatio={false} />
            )}
        </>
    );
}
