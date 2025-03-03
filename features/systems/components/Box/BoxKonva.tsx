import Konva from "konva";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";
import { useResizeDetector } from "react-resize-detector";
import { useBox } from "../../contexts/BoxContext";

const KonvaSquare = () => {
  const { ref, width = 400, height = 400 } = useResizeDetector();
  const { focusNode, mapBounding, setMapBounding, focusPoint , config} = useBox();

  const [squareSize, setSquareSize] = useState({ width: 0, height: 0 });
  const [relativePos, setRelativePos] = useState<{ x: number; y: number | null }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [showPoints, setShowPoints] = useState(true);
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
      }else{
        setSquareSize({ width: 0, height: 0 });
      }
    }
    else{
      setSquareSize({ width: 0, height: 0 });
    }
  }, [focusNode?.id, mapBounding, width, height]);

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const unscaledX = (pointer.x - offset.x) / zoom;
    const unscaledY = (pointer.y - offset.y) / zoom;

    if (unscaledX >= 0 && unscaledX <= squareSize.width && unscaledY >= 0 && unscaledY <= squareSize.height) {
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

    const x = unscaledX / squareSize.width;
    const y = unscaledY / squareSize.height;

    if (focusPoint !== "") {
      if (focusPoint === "Reference Point") {
        setMapBounding((prev) => {
          const newMapBounding = new Map(prev);
          newMapBounding.set(focusNode!.id, {
            ...newMapBounding.get(focusNode!.id)!,
            referencePosition: [x, y] as [number, number],
          });
          return newMapBounding;
        });
        alert(focusPoint + " at" + ` (${x}, ${y})`);
      } else {
        setMapBounding((prev) => {
          const newMapBounding = new Map(prev);
          const nodeInfo = newMapBounding.get(focusNode!.id);
          if (nodeInfo) {
            const newInterfacePositions = new Map(nodeInfo.interfacePositions);
            newInterfacePositions.set(focusPoint, [x, y] as [number, number]);
            newMapBounding.set(focusNode!.id, {
              ...nodeInfo,
              interfacePositions: newInterfacePositions,
            });
          }
          return newMapBounding;
        });
        alert(focusPoint + " at" + ` (${x}, ${y})`);
      }
    } else {
      alert("no focus point selected");
    }
  };

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <button onClick={() => setShowPoints((prev) => !prev)}>
        {showPoints ? "Hide" : "Show"} Points
      </button>
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
            onClick={handleRectClick}
          />
          
                  <>
          {relativePos.y !== null && (
            <Text
              text={`(${relativePos.x}, ${relativePos.y})`}
              x={offset.x + relativePos.x * zoom + 10}
              y={offset.y + relativePos.y * zoom - 10}
              fontSize={16}
              fill="black"
            />
          )}

          {showPoints && focusNode && (() => {
            const combinedPoints = new Map<string, { x: number, y: number, labels: string[] }>();

            // Add reference point
            const referencePosition = mapBounding.get(focusNode.id)?.referencePosition;
            if (referencePosition) {
              const [refX, refY] = referencePosition;
              const key = `${refX},${refY}`;
              combinedPoints.set(key, {
                x: refX,
                y: refY,
                labels: ['Reference Point']
              });
            }

            // Add interface points
            const interfacePositions = mapBounding.get(focusNode.id)?.interfacePositions;
            if (interfacePositions) {
              interfacePositions.forEach((pos, key) => {
              const interfaceName = config.types.find((type) => type.id === focusNode.type)?.interfaces.find((intf) => intf.id === key)?.name;
              const [intX, intY] = pos;
              const pointKey = `${intX},intY}`;
              if (combinedPoints.has(pointKey)) {
                combinedPoints.get(pointKey)!.labels.push(interfaceName || key);
              } else {
                combinedPoints.set(pointKey, {
                x: intX,
                y: intY,
                labels: [interfaceName || key]
                });
              }
              });
            }

            // Render combined points
            return Array.from(combinedPoints.values()).map(({ x, y, labels }) => (
              <React.Fragment key={`${x},${y}`}>
                <Circle
                  x={offset.x + x * squareSize.width * zoom}
                  y={offset.y + y * squareSize.height * zoom}
                  radius={5}
                  fill="green"
                />
                <Text
                  text={`(${x*squareSize.width}, ${y*squareSize.height})\n${labels.join(', ')}`}
                  x={offset.x + x * squareSize.width * zoom + 10}
                  y={offset.y + y * squareSize.height * zoom - 10}
                  fontSize={16}
                  fill="black"
                />
              </React.Fragment>
            ));
          })()}
        </>
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaSquare;