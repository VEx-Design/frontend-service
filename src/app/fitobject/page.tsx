"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Stage, Layer, Rect } from "react-konva";

const cmToPx = (cm: number) => cm * 37.7952755906;

const FitObject = () => {
  const searchParams = useSearchParams();

  const widthCm = Number(searchParams.get("width")) || 10;
  const heightCm = Number(searchParams.get("height")) || 10;

  const widthPx = cmToPx(widthCm);
  const heightPx = cmToPx(heightCm);

  const maxBoardSize = 600;

  const scale = Math.min(maxBoardSize / widthPx, maxBoardSize / heightPx);

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const scaledWidth = widthPx * scale;
    const scaledHeight = heightPx * scale;

    const maxX = scaledWidth - cmToPx(25) * scale;
    const maxY = scaledHeight - cmToPx(25) * scale;

    const minX = 0;
    const minY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Stage
        width={maxBoardSize}
        height={maxBoardSize}
        scaleX={scale}
        scaleY={scale}
        className="border border-gray-300"
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={cmToPx(25)}
            height={cmToPx(25)}
            fill="gray"
            draggable
            dragBoundFunc={dragBoundFunc}
          />

          <Rect
            x={0}
            y={0}
            width={cmToPx(25)}
            height={cmToPx(25)}
            fill="gray"
            draggable
            dragBoundFunc={dragBoundFunc}
          />

          <Rect
            x={0}
            y={0}
            width={cmToPx(25)}
            height={cmToPx(25)}
            fill="gray"
            draggable
            dragBoundFunc={dragBoundFunc}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default FitObject;
