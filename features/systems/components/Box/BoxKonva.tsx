import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text as KonvaText } from "react-konva";
import { useBox } from "../../contexts/BoxContext";
import Konva from "konva";

export default function BoxKonva() {
  const { focusNode, mapBounding, setFocusPoint, focusPoint } = useBox();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rectDimensions, setRectDimensions] = useState({ width: 100, height: 100 });
  const [scale, setScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });

        // Center (0,0) in the viewport
        setStagePosition({ x: clientWidth / 2, y: clientHeight / 2 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (focusNode) {
      const nodeInfo = mapBounding.get(focusNode.id);
      if (nodeInfo) {
        setRectDimensions({ width: nodeInfo.width, height: nodeInfo.height });
      }
    }
  }, [focusNode, mapBounding]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setStagePosition(newPos);
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Transform mouse position to match the scene coordinate space
    const transformedPosition = {
      x: (pointer.x - stagePosition.x) / scale,
      y: (pointer.y - stagePosition.y) / scale,
    };

    setMousePosition(transformedPosition);
  };

  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Transform pointer position to match the scene coordinate space
    const transformedPosition = {
      x: (pointer.x - stagePosition.x) / scale,
      y: (pointer.y - stagePosition.y) / scale,
    };

    setFocusPoint("");
    setContextMenuPosition({ x: e.evt.clientX, y: e.evt.clientY });
    setContextMenuVisible(true);
  };

  const handleClick = () => {
    setContextMenuVisible(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()} // Prevent default browser context menu
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={stagePosition.x}
        y={stagePosition.y}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
      >
        <Layer>
          {/* Rectangle centered at (0,0) */}
          <Rect
            x={-rectDimensions.width / 2}
            y={-rectDimensions.height / 2}
            width={rectDimensions.width}
            height={rectDimensions.height}
            fill="grey"
          />
        </Layer>

        {/* Separate Layer for Fixed Text */}
       
      </Stage>

      {contextMenuVisible && (
        <div
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "5px",
            zIndex: 1000,
          }}
        >
          {focusPoint ? `Set "${focusPoint.x.toFixed(2)}, ${focusPoint.y.toFixed(2)}"` : "No point selected"}
        </div>
      )}
    </div>
  );
}