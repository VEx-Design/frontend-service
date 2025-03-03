import Konva from "konva";
import { useState } from "react";
import { Stage, Layer, Rect, Circle, Group, Image } from "react-konva";
import useImage from "use-image";

const GRID_SPACING = 50;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Yoda_Attack_of_the_Clones.png/220px-Yoda_Attack_of_the_Clones.png"; // Replace with your image URL

const SnapGrid = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [rotation, setRotation] = useState(0);
  const [image] = useImage(IMAGE_URL);

  const snapToGrid = (value: number) =>
    Math.round(value / GRID_SPACING) * GRID_SPACING;

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({
      x: snapToGrid(e.target.x()),
      y: snapToGrid(e.target.y()),
    });
  };

  const handleRotate = (angle: number) => {
    setRotation((prev) => (prev + angle) % 360);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300"
      >
        <Layer>
          {/* Grid of Points */}
          {[...Array(Math.floor(CANVAS_WIDTH / GRID_SPACING))].map((_, i) =>
            [...Array(Math.floor(CANVAS_HEIGHT / GRID_SPACING))].map((_, j) => (
              <Circle
                key={`${i}-${j}`}
                x={i * GRID_SPACING}
                y={j * GRID_SPACING}
                radius={2}
                fill="#555"
              />
            ))
          )}

          {/* Draggable Group with Reference Point as Rotation Center */}
          <Group
            x={position.x}
            y={position.y}
            draggable
            rotation={rotation}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {/* Reference Point Fixed at Center Snapped to Grid */}
            <Circle x={0} y={0} radius={5} fill="black" />
            {/* Rect Rotating Around Reference Point */}
            <Rect
              x={0}
              y={-25}
              width={50}
              height={50}
              fill="#808b96"
              opacity={0.6}
            />
            {/* Circular Cropped Image on Top of Rect */}
            {image && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.arc(0, 0, 20, 0, Math.PI * 2, false);
                  ctx.closePath();
                }}
              >
                <Image
                  image={image}
                  x={-20}
                  y={-20}
                  width={40}
                  height={40}
                  alt="Cropped image"
                />
              </Group>
            )}
          </Group>
        </Layer>
      </Stage>

      {/* Rotate Controls */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => handleRotate(15)}
          className="p-2 bg-gray-700 text-white rounded"
        >
          ↻ Rotate +15°
        </button>
        <button
          onClick={() => handleRotate(-15)}
          className="p-2 bg-gray-700 text-white rounded"
        >
          ↺ Rotate -15°
        </button>
      </div>
    </div>
  );
};

export default SnapGrid;
