"use client";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Line, Circle } from "react-konva";
import { FaRegHandPaper } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import { LuMousePointer2 } from "react-icons/lu";
import Konva from "konva";
import { useCanvas } from "./CanvasContext";

const Canvas = ({}) => {
  // Refs
  const stageRef = useRef<Konva.Stage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas dimensions
  const { canvasState, setCanvasState } = useCanvas();
  const CANVAS_WIDTH = canvasState.canvas.width;
  const CANVAS_HEIGHT = canvasState.canvas.height;
  // console.log("H:", CANVAS_HEIGHT, "W:", CANVAS_WIDTH);

  // Grid-related state from canvasState
  const { showGrid, gridSize, gridColor, gridOpacity } = canvasState.canvas;

  // State
  const [action, setAction] = useState<string>("Move");
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [zoomScale, setZoomScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Constants
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  const ZOOM_FACTOR = 1.2;

  // Update stage size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Calculate stage scaling to fit canvas
  const getStageScale = () => {
    const scaleX = stageSize.width / CANVAS_WIDTH;
    const scaleY = stageSize.height / CANVAS_HEIGHT;
    return Math.min(scaleX, scaleY, 1);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev * ZOOM_FACTOR, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev / ZOOM_FACTOR, MIN_ZOOM));
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = zoomScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0
        ? Math.max(oldScale / ZOOM_FACTOR, MIN_ZOOM)
        : Math.min(oldScale * ZOOM_FACTOR, MAX_ZOOM);

    setZoomScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStagePos(newPos);
  };

  // Pan handlers
  const handleDragStart = () => {
    if (action === "Move") {
      setIsDragging(true);
    }
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (action === "Move" && isDragging) {
      setStagePos({
        x: e.target.x(),
        y: e.target.y(),
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleExport = () => {
    setAction("Export");
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Object manipulation handlers
  const handleObjectDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (action !== "Select") return;

    const rect = e.target;
    const scale = getStageScale();

    const x = Math.max(
      0,
      Math.min(rect.x(), canvasState.canvas.width * scale - rect.width())
    );
    const y = Math.max(
      0,
      Math.min(rect.y(), canvasState.canvas.height * scale - rect.height())
    );

    rect.position({ x, y });

    // Update object position in state
    const updatedX = x / scale;
    const updatedY = y / scale;

    setCanvasState((prevState) => {
      const updatedObjects = prevState.objects.map((obj) =>
        obj.id === rect.id() ? { ...obj, x: updatedX, y: updatedY } : obj
      );

      return {
        ...prevState,
        objects: updatedObjects,
        selectedObject:
          prevState.selectedObject?.id === rect.id()
            ? { ...prevState.selectedObject, x: updatedX, y: updatedY }
            : prevState.selectedObject,
      };
    });
  };

  // // Function to create grid lines
  const createGridLines = () => {
    if (!showGrid) return [];

    const lines = [];
    const gridSizeScaled = gridSize;

    // Vertical lines
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSizeScaled) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, CANVAS_HEIGHT]}
          stroke={gridColor}
          strokeWidth={1}
          opacity={gridOpacity}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSizeScaled) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, CANVAS_WIDTH, y]}
          stroke={gridColor}
          strokeWidth={1}
          opacity={gridOpacity}
        />
      );
    }

    return lines;
  };

  const createGridDots = () => {
    if (!showGrid) return [];

    const dots = [];
    const gridSizeScaled = gridSize;

    // สร้างจุดตามตำแหน่งที่ grid lines ตัดกัน
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSizeScaled) {
      for (let y = 0; y <= CANVAS_HEIGHT; y += gridSizeScaled) {
        dots.push(
          <Circle
            key={`${x}-${y}`}
            x={x}
            y={y}
            radius={1.5} // ขนาดของจุด
            fill={gridColor}
            opacity={gridOpacity}
            perfectDrawEnabled={false} // เพิ่มประสิทธิภาพการ render
          />
        );
      }
    }

    return dots;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-200 overflow-hidden"
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoomScale}
        scaleY={zoomScale}
        x={stagePos.x}
        y={stagePos.y}
        draggable={action === "Move"}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onWheel={handleWheel}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill="white"
          />

          {/* Grid */}
          {canvasState.canvas.gridStyle === "line"
            ? createGridLines()
            : createGridDots()}

          {/* Objects */}
          {canvasState.objects.map((obj) => (
            <Rect
              key={obj.id}
              id={obj.id}
              x={obj.x}
              y={obj.y}
              width={obj.width}
              height={obj.height}
              fill={obj.fill}
              draggable={action === "Select"}
              onDragMove={handleObjectDragMove}
              onClick={() =>
                action === "Select" &&
                setCanvasState((prevState) => ({
                  ...prevState,
                  selectedObject: obj,
                }))
              }
              stroke={
                canvasState.selectedObject?.id === obj.id ? "red" : undefined
              }
              strokeWidth={2}
            />
          ))}
        </Layer>
      </Stage>

      {/* Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-2 rounded-lg shadow">
        <button
          className={`p-2 rounded ${action === "Move" ? "bg-gray-200" : ""}`}
          onClick={() => setAction("Move")}
        >
          {}
          <FaRegHandPaper size={20} />
        </button>
        <button
          className={`p-2 rounded ${action === "Select" ? "bg-gray-200" : ""}`}
          onClick={() => setAction("Select")}
        >
          {}
          <LuMousePointer2 size={20} />
        </button>
        {/* <button className="p-2 rounded" onClick={handleZoomIn}>
          <ZoomIn size={20} />
        </button>
        <button className="p-2 rounded" onClick={handleZoomOut}>
          <ZoomOut size={20} />
        </button> */}
        <button
          className={`p-2 rounded ${action === "Export" ? "bg-gray-200" : ""}`}
          onClick={handleExport}
        >
          {}
          <AiOutlineExport size={20} />
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white rounded shadow flex space-x-4">
        <button className="px-2 py-1" onClick={handleZoomIn}>
          +
        </button>
        <span className="py-1">{Math.round(zoomScale * 100)}%</span>
        <button className="px-2 py-1" onClick={handleZoomOut}>
          -
        </button>
      </div>
    </div>
  );
};

export default Canvas;
