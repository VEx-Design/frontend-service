// components/DrawingCanvas.tsx
import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

// Define type for different shapes
type ShapeType = "rect" | "circle" | "line" | "text" | "select";

// Define interface for each shape
interface BaseShape {
  id: string;
  type: ShapeType;
  draggable?: boolean;
}

interface RectShape extends BaseShape {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

interface CircleShape extends BaseShape {
  type: "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

interface LineShape extends BaseShape {
  type: "line";
  points: number[];
  stroke: string;
  strokeWidth: number;
}

interface TextShape extends BaseShape {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

type Shape = RectShape | CircleShape | LineShape | TextShape;

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onExport: (shapes: Omit<Shape, "id" | "draggable">[]) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width = 800,
  height = 600,
  onExport,
}) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [tool, setTool] = useState<ShapeType>("rect");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");
  const [textValue, setTextValue] = useState<string>("");
  const [points, setPoints] = useState<number[]>([]);

  const stageRef = useRef<Konva.Stage>(null);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "select") return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (tool === "text") {
      const newText: TextShape = {
        id: uuidv4(),
        type: "text",
        x: pos.x,
        y: pos.y,
        text: textValue || "Double click to edit",
        fontSize: 16,
        fill: color,
        draggable: true,
      };

      setShapes([...shapes, newText]);
      setSelectedShape(newText.id);
      return;
    }

    if (tool === "line") {
      setIsDrawing(true);
      setPoints([pos.x, pos.y]);
      return;
    }

    // For rectangles and circles
    if (tool === "rect" || tool === "circle") {
      const newShape: RectShape | CircleShape = {
        id: uuidv4(),
        type: tool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: color,
        draggable: true,
      };

      setShapes([...shapes, newShape]);
      setSelectedShape(newShape.id);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    if (tool === "line") {
      setPoints([...points, pos.x, pos.y]);
      return;
    }

    // For rectangles and circles
    const updatedShapes = shapes.map((shape) => {
      if (
        shape.id === selectedShape &&
        (shape.type === "rect" || shape.type === "circle")
      ) {
        return {
          ...shape,
          width: pos.x - shape.x,
          height: pos.y - shape.y,
        };
      }
      return shape;
    });

    setShapes(updatedShapes);
  };

  const handleMouseUp = () => {
    if (tool === "line" && isDrawing) {
      const newLine: LineShape = {
        id: uuidv4(),
        type: "line",
        points: points,
        stroke: color,
        strokeWidth: 2,
        draggable: true,
      };

      setShapes([...shapes, newLine]);
      setSelectedShape(newLine.id);
      setPoints([]);
    }

    setIsDrawing(false);
  };

  const handleShapeClick = (id: string) => {
    if (tool === "select") {
      setSelectedShape(id);
    }
  };

  const handleTextDblClick = (id: string) => {
    const textNode = shapes.find((shape) => shape.id === id) as
      | TextShape
      | undefined;
    if (!textNode) return;

    // Create a text input
    const textPosition = {
      x: textNode.x,
      y: textNode.y,
    };

    const input = document.createElement("input");
    input.value = textNode.text;
    input.style.position = "absolute";
    input.style.left = `${textPosition.x}px`;
    input.style.top = `${textPosition.y}px`;

    document.body.appendChild(input);
    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const updatedShapes = shapes.map((shape) => {
          if (shape.id === id && shape.type === "text") {
            return {
              ...shape,
              text: input.value,
            };
          }
          return shape;
        });

        setShapes(updatedShapes);
        document.body.removeChild(input);
      }
    });

    input.addEventListener("blur", () => {
      document.body.removeChild(input);
    });
  };

  const handleShapeDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    id: string
  ) => {
    console.log(e);
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return {
          ...shape,
          ...e.target.absolutePosition(),
        };
      }
      return shape;
    });

    setShapes(updatedShapes);
  };

  const handleDeleteShape = () => {
    if (selectedShape) {
      const updatedShapes = shapes.filter(
        (shape) => shape.id !== selectedShape
      );
      setShapes(updatedShapes);
      setSelectedShape(null);
    }
  };

  const handleExport = () => {
    // Create a simplified version of shapes for export
    const exportData = shapes.map(({ ...exportShape }) => exportShape);

    onExport(exportData as Omit<Shape, "id" | "draggable">[]);
  };

  const renderShape = (shape: Shape) => {
    const isSelected = shape.id === selectedShape;
    const commonProps = {
      key: shape.id,
      onClick: () => handleShapeClick(shape.id),
      draggable: true,
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) =>
        handleShapeDragEnd(e, shape.id),
      stroke: isSelected ? "blue" : undefined,
      strokeWidth: isSelected ? 2 : 0,
    };

    switch (shape.type) {
      case "rect":
        return (
          <Rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
          />
        );
      case "circle":
        return (
          <Circle
            {...commonProps}
            x={shape.x + shape.width / 2}
            y={shape.y + shape.height / 2}
            radius={Math.max(Math.abs(shape.width), Math.abs(shape.height)) / 2}
            fill={shape.fill}
          />
        );
      case "line":
        return (
          <Line
            {...commonProps}
            points={shape.points}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
          />
        );
      case "text":
        return (
          <Text
            {...commonProps}
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={shape.fontSize}
            fill={shape.fill}
            onDblClick={() => handleTextDblClick(shape.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="drawing-canvas">
      <div className="toolbar">
        <div className="tools">
          <button
            onClick={() => setTool("select")}
            className={tool === "select" ? "active" : ""}
          >
            Select
          </button>
          <button
            onClick={() => setTool("rect")}
            className={tool === "rect" ? "active" : ""}
          >
            Rectangle
          </button>
          <button
            onClick={() => setTool("circle")}
            className={tool === "circle" ? "active" : ""}
          >
            Circle
          </button>
          <button
            onClick={() => setTool("line")}
            className={tool === "line" ? "active" : ""}
          >
            Line
          </button>
          <button
            onClick={() => setTool("text")}
            className={tool === "text" ? "active" : ""}
          >
            Text
          </button>
        </div>

        <div className="color-picker">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {tool === "text" && (
          <input
            type="text"
            placeholder="Enter text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
        )}

        <button onClick={handleDeleteShape} disabled={!selectedShape}>
          Delete
        </button>

        <button onClick={handleExport}>Export</button>
      </div>

      <div className="canvas-container">
        <Stage
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
          style={{ border: "1px solid #ccc" }}
        >
          <Layer>
            {shapes.map(renderShape)}
            {isDrawing && tool === "line" && (
              <Line points={points} stroke={color} strokeWidth={2} />
            )}
          </Layer>
        </Stage>
      </div>

      <style jsx>{`
        .drawing-canvas {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .tools {
          display: flex;
          gap: 8px;
        }

        button {
          padding: 8px 12px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }

        button.active {
          background: #007bff;
          color: white;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .canvas-container {
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default DrawingCanvas;
