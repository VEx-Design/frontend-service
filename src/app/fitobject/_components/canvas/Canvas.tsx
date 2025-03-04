import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Line,
  Circle,
  Image as KonvaImage,
  Group,
  Rect,
} from "react-konva";
import { useCanvas } from "./CanvasContext";
import useImage from "use-image";
import Konva from "konva";
import { FaRegHandPaper } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import { LuMousePointer2 } from "react-icons/lu";

interface KonvaObjectProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: { x: number; y: number }) => void;
  draggable: boolean;
  allObjects: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  referencePosition: [number,number]; // Added reference position
  gridSize: number; // Added grid size for snapping
  showGrid: boolean; // Added to check if grid is enabled
  gridStyle: "dot" | "line"; // Added to check if grid style is dot
}

const Object: React.FC<KonvaObjectProps> = ({
  id,
  x,
  y,
  width,
  height,
  imageUrl,
  isSelected,
  onSelect,
  onChange,
  draggable,
  allObjects,
  referencePosition,
  gridSize,
  showGrid,
  gridStyle,
}) => {
  const [image] = useImage(imageUrl, 'anonymous');
  const [isColliding, setIsColliding] = useState(false);

  const circleSize = Math.min(width, height) * 0.8;
  const circleX = width / 2;
  const circleY = height / 2;

  const checkCollision = useCallback(
    (currentX: number, currentY: number) => {
      return allObjects.some((obj) => {
        if (obj.id === id) return false;

        const isOverlapping =
          currentX < obj.x + obj.width &&
          currentX + width > obj.x &&
          currentY < obj.y + obj.height &&
          currentY + height > obj.y;

        return isOverlapping;
      });
    },
    [id, width, height, allObjects]
  );

  useEffect(() => {
    setIsColliding(checkCollision(x, y));
  }, [x, y, checkCollision]);

  // Calculate reference point coordinates
  const getReferencePointCoordinates = (objX: number, objY: number) => {
    const refX = objX + width * referencePosition[0];
    const refY = objY + height * referencePosition[1];
    return { refX, refY };
  };

  // Function to snap to grid dots
  const snapToGrid = (objX: number, objY: number) => {
    if (!showGrid || gridStyle !== "dot") return { x: objX, y: objY };

    const { refX, refY } = getReferencePointCoordinates(objX, objY);

    // Calculate the closest grid point
    const snapX = Math.round(refX / gridSize) * gridSize;
    const snapY = Math.round(refY / gridSize) * gridSize;

    // Adjust position to align reference point with the grid
    const newX = objX + (snapX - refX);
    const newY = objY + (snapY - refY);

    return { x: newX, y: newY };
  };

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragMove={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();

        setIsColliding(checkCollision(newX, newY));
      }}
      onDragEnd={(e) => {
        let newX = e.target.x();
        let newY = e.target.y();

        // Apply snapping when drag ends
        if (showGrid && gridStyle === "dot") {
          const snapped = snapToGrid(newX, newY);
          newX = snapped.x;
          newY = snapped.y;

          // Update the position on the stage
          e.target.position({ x: newX, y: newY });
        }

        onChange({
          x: newX,
          y: newY,
        });
      }}
      onClick={onSelect}
    >
      {/* Background Rectangle */}
      <Rect
        width={width}
        height={height}
        fill={isColliding ? "rgba(255, 0, 0, 0.5)" : "white"}
        stroke={isSelected ? "#00ff00" : "#ddd"}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={5}
      />

      {/* Circular Clipping Area */}
      <Group
        clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.arc(circleX, circleY, circleSize / 2, 0, Math.PI * 2, false);
          ctx.closePath();
        }}
      >
        <KonvaImage
          image={image}
          x={circleX - circleSize / 2}
          y={circleY - circleSize / 2}
          width={circleSize}
          height={circleSize}
        />
      </Group>

      {/* Circle border */}
      <Circle
        x={circleX}
        y={circleY}
        radius={circleSize / 2}
        stroke="#ddd"
        strokeWidth={1}
      />

      {/* Reference Point Indicator (visible when selected) */}
      {isSelected && (
        <Circle
          x={width * referencePosition[0]}
          y={height * referencePosition[1]}
          radius={4}
          fill="#ff0000"
          opacity={0.8}
        />
      )}
    </Group>
  );
};

function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  
  const { canvas, selectObject, updateObject } = useCanvas();
  const { gridSize, gridColor, gridOpacity, gridStyle } = canvas.grid;

  const [zoomScale, setZoomScale] = useState<number>(1);

  const [action, setAction] = useState<string>("Move");

  const [stageSize, setStageSize] = useState({ width: 1, height: 1 })

  // Function to update stage size based on container dimensions
  const updateStageDimensions = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const containerHeight = containerRef.current.offsetHeight

      setStageSize({
        width: containerWidth,
        height: containerHeight,
      })
    }
  }, [])

  useEffect(() => {
    updateStageDimensions()

    // Set up resize observer to update dimensions when container resizes
    const resizeObserver = new ResizeObserver(() => {
      updateStageDimensions()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Clean up
    return () => {
      resizeObserver.disconnect()
    }
  }, [updateStageDimensions])

  const RenderGrid = () => {
    if (!canvas.grid.showGrid) return null;

    const gridLines = [];

    if (gridStyle === "dot") {
      for (
        let i = gridSize * 2;
        i < canvas.canvasWidth - gridSize;
        i += gridSize
      ) {
        for (
          let j = gridSize * 2;
          j < canvas.canvasHeight - gridSize;
          j += gridSize
        ) {
          gridLines.push(
            <Circle
              key={`d${i}-${j}`}
              radius={1}
              x={i}
              y={j}
              fill={gridColor}
              opacity={gridOpacity}
            />
          );
        }
      }
    } else {
      for (let i = gridSize; i < canvas.canvasWidth; i += gridSize) {
        gridLines.push(
          <Line
            key={`v${i}`}
            points={[i, 0, i, canvas.canvasHeight]}
            stroke={gridColor}
            opacity={gridOpacity}
            strokeWidth={1}
          />
        );
      }
    }
    if (gridStyle === "line") {
      for (let i = gridSize; i < canvas.canvasHeight; i += gridSize) {
        gridLines.push(
          <Line
            key={`h${i}`}
            points={[0, i, canvas.canvasWidth, i]}
            stroke={gridColor}
            opacity={gridOpacity}
            strokeWidth={1}
          />
        );
      }
    }
    return gridLines;
  };

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      console.log(e.target.getStage());
      if (e.target === e.target.getStage()) {
        selectObject(null);
      }
    },
    [selectObject]
  );

  const handleExport = () => {
    setAction("Export");
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = zoomScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const newScale =
      e.evt.deltaY > 0
        ? Math.max(oldScale / 1.1, 0.1)
        : Math.min(oldScale * 1.1, 5);

    setZoomScale(newScale);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black" ref={containerRef}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoomScale}
        scaleY={zoomScale}
        className="bg-gray-200"
        draggable={action === "Move"}
        onClick={handleStageClick}
        onWheel={handleWheel}
      >
        {/* Object Layer */}
        <Layer width={canvas.canvasWidth} height={canvas.canvasHeight}>
          <Rect
            width={canvas.canvasWidth}
            height={canvas.canvasHeight}
            onClick={() => selectObject(null)}
            fill="white"
          />
          {canvas.objects.map((obj) => (
            <Object
              key={obj.id}
              id={obj.id}
              x={obj.x}
              y={obj.y}
              width={obj.width}
              height={obj.height}
              imageUrl={obj.imageUrl}
              isSelected={obj.id === canvas.selectedObjectId}
              onSelect={() => {
                selectObject(obj.id)
              }}
              onChange={(newProps) => updateObject(obj.id, newProps)}
              draggable={action === "Select"}
              allObjects={canvas.objects}
              referencePosition={obj.referencePosition || [0.5, 0.5]} // Default to center if not defined
              gridSize={canvas.grid.gridSize}
              showGrid={canvas.grid.showGrid}
              gridStyle={canvas.grid.gridStyle}
            />
          ))}
          {RenderGrid()}
        </Layer>
      </Stage>

      {/* Control */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-2 rounded-lg shadow">
        <button className={`p-2 rounded ${action === "Move" ? "bg-gray-200" : ""}`} onClick={() => setAction("Move")}>
          <FaRegHandPaper size={20} />
        </button>
        <button
          className={`p-2 rounded ${action === "Select" ? "bg-gray-200" : ""}`}
          onClick={() => setAction("Select")}
        >
          <LuMousePointer2 size={20} />
        </button>
        <button className={`p-2 rounded ${action === "Export" ? "bg-gray-200" : ""}`} onClick={handleExport}>
          <AiOutlineExport size={20} />
        </button>
      </div>
    </div>
  )
}

export default Canvas;
