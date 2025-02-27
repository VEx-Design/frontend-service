import Konva from "konva";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import { useResizeDetector } from "react-resize-detector";
import { useBox } from "../../contexts/BoxContext";

const KonvaSquare = () => {
  const { ref, width = 400, height = 400 } = useResizeDetector();
  const {focusNode, mapBounding} = useBox();
  const [squareSize , setSquareSize] = useState({ width: 0, height: 0 });
  const [relativePos, setRelativePos] = useState<{
    x: number;
    y: number | null;
  }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  
  useEffect(() => {
    if (focusNode) {
      const nodeInfo = mapBounding.get(focusNode.id);
      if (nodeInfo) {
        const newSquareSize = { width: nodeInfo.width, height: nodeInfo.height };
        setSquareSize(newSquareSize);
        if (width > 0 && height > 0) {
          const padding = 0.1;
          const maxWidthZoom = (width * (1 - padding)) / newSquareSize.width;
          const maxHeightZoom = (height * (1 - padding)) / newSquareSize.height;
          const newZoom = Math.min(maxWidthZoom, maxHeightZoom, 1);

          setZoom(newZoom);
          setOffset({
            x: width / 2 - (newSquareSize.width * newZoom) / 2,
            y: height / 2 - (newSquareSize.height * newZoom) / 2,
          });
        }
      }
    }
  }, [focusNode?.id, mapBounding, width, height]);

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const unscaledX = (pointer.x - offset.x) / zoom;
    const unscaledY = (pointer.y - offset.y) / zoom;

    if (
      unscaledX >= 0 &&
      unscaledX <= squareSize.width &&
      unscaledY >= 0 &&
      unscaledY <= squareSize.height
    ) {
      setRelativePos({ x: Math.floor(unscaledX), y: Math.floor(unscaledY) });
    } else {
      setRelativePos({ x: 0, y: null });
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsDragging(true);
    setLastMouse({ x: e.evt.clientX, y: e.evt.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMoveDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isDragging) {
      const dx = e.evt.clientX - lastMouse.x;
      const dy = e.evt.clientY - lastMouse.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMouse({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.05;
    const oldScale = zoom;
    const pointer = stage?.getPointerPosition();
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    if (!pointer) return;
    const mouseXBeforeZoom = (pointer.x - offset.x) / oldScale;
    const mouseYBeforeZoom = (pointer.y - offset.y) / oldScale;

    setZoom(Math.max(0.3, Math.min(2, newScale)));
    setOffset({
      x: pointer.x - mouseXBeforeZoom * newScale,
      y: pointer.y - mouseYBeforeZoom * newScale,
    });
  };

  const handleRectClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const unscaledX = (pointer.x - offset.x) / zoom;
    const unscaledY = (pointer.y - offset.y) / zoom;

    alert(`Clicked at: (${Math.floor(unscaledX)}, ${Math.floor(unscaledY)})`);
  };

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMoveCapture={handleMouseMoveDrag}
        onWheel={handleWheel}
      >
        <Layer>
          <Rect
            x={offset.x}
            y={offset.y}
            width={squareSize.width * zoom}
            height={squareSize.height * zoom}
            fill="rgba(100, 200, 255, 1)"
            onClick={handleRectClick} // Click handler added here
          />
          {relativePos.y !== null && (
            <Text
              text={`(${relativePos.x}, ${relativePos.y})`}
              x={offset.x + relativePos.x * zoom + 10}
              y={offset.y + relativePos.y * zoom - 10}
              fontSize={16}
              fill="black"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaSquare;