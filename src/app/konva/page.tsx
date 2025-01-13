"use client";
import React, { useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";

const OrthogonalLineInteractive = () => {
  const [points, setPoints] = useState([50, 50, 150, 50, 150, 150, 250, 150]);
  const [dragging, setDragging] = useState(false);
  const [draggedPoint, setDraggedPoint] = useState(null);

  const handleDragMove = (e) => {
    if (!dragging) return;
    const newPoints = [...points];
    const newPointIndex = draggedPoint * 2;

    // อัปเดตจุดที่ถูกลาก
    newPoints[newPointIndex] = e.target.x();
    newPoints[newPointIndex + 1] = e.target.y();

    setPoints(newPoints);
  };

  const handleDragStart = (index) => {
    setDragging(true);
    setDraggedPoint(index);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDraggedPoint(null);
  };

  return (
    <Stage width={500} height={500}>
      <Layer>
        {/* เส้น orthogonal */}
        <Line
          points={points}
          stroke="black"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />

        {/* จุดลาก */}
        {points.map((point, index) => {
          return index % 2 === 0 ? (
            <Circle
              key={index}
              x={point}
              y={points[index + 1]}
              radius={6}
              fill="red"
              draggable
              onDragMove={handleDragMove}
              onDragStart={() => handleDragStart(index / 2)}
              onDragEnd={handleDragEnd}
            />
          ) : null;
        })}
      </Layer>
    </Stage>
  );
};

export default OrthogonalLineInteractive;
