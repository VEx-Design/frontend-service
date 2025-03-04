import type Konva from "konva";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";
import { useResizeDetector } from "react-resize-detector";
import { useBox } from "../../contexts/BoxContext";
import type { BoundingConfiguration } from "../../libs/ClassBox/types/BoundingConfiguration";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, EyeOff, Maximize } from "lucide-react";
import { useConfig } from "../../contexts/ProjectWrapper/ConfigContext";
import { FaRegHandPaper } from "react-icons/fa";

export default function BoxKonva() {
  const { ref, width = 400, height = 400 } = useResizeDetector();
  const { focusNode, focusPoint, config, nodesState } = useBox();
  const { mapBounding, setMapBounding } = useConfig() as {
    mapBounding: Map<string, BoundingConfiguration>;
    setMapBounding: React.Dispatch<
      React.SetStateAction<Map<string, BoundingConfiguration>>
    >;
    blueprint: Map<string, BoundingConfiguration[]>;
    setBlueprint: React.Dispatch<
      React.SetStateAction<Map<string, BoundingConfiguration[]>>
    >;
  };

  // Scaling factor: 1mm = 10px
  const scalingFactor = 10;

  const [squareSize, setSquareSize] = useState({ width: 0, height: 0 });
  const [relativePos, setRelativePos] = useState<{
    x: number;
    y: number | null;
  }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [showPoints, setShowPoints] = useState(true);
  const stageRef = useRef<Konva.Stage>(null);

  // Add new state variables and functions
  const [action, setAction] = useState<"move" | "select">("select")
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (focusNode) {
      const nodeInfo = mapBounding.get(focusNode.id);
      if (nodeInfo) {
        // Ensure width and height are valid numbers
        const nodeWidth =
          typeof nodeInfo.width === "number" && !isNaN(nodeInfo.width)
            ? nodeInfo.width
            : 0;
        const nodeHeight =
          typeof nodeInfo.height === "number" && !isNaN(nodeInfo.height)
            ? nodeInfo.height
            : 0;

        // Apply scaling factor to convert mm to pixels
        const scaledWidth = nodeWidth * scalingFactor;
        const scaledHeight = nodeHeight * scalingFactor;

        const newSquareSize = { width: scaledWidth, height: scaledHeight };
        setSquareSize(newSquareSize);

        // Center the square and set initial zoom
        if (width > 0 && height > 0 && scaledWidth > 0 && scaledHeight > 0) {
          const padding = 0.1;
          const maxWidthZoom = (width * (1 - padding)) / scaledWidth;
          const maxHeightZoom = (height * (1 - padding)) / scaledHeight;
          const newZoom = Math.min(maxWidthZoom, maxHeightZoom, 1);

          setZoom(newZoom)
          setStagePos({
            x: (width - scaledWidth * newZoom) / 2,
            y: (height - scaledHeight * newZoom) / 2,
          })
        }
      } else {
        setSquareSize({ width: 0, height: 0 });
      }
    } else {
      setSquareSize({ width: 0, height: 0 });
    }
  }, [focusNode, mapBounding, width, height]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only start dragging if in move mode and not clicking on a point
    if (action === "move" && e.target === e.target.getStage()) {
      setIsDragging(true)
      setLastMouse(e.target.getStage()!.getPointerPosition()!)
    }
  }

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragging) return

    const stage = e.target.getStage()!
    const pointerPos = stage.getPointerPosition()!
    const dragDistance = {
      x: pointerPos.x - lastMouse.x,
      y: pointerPos.y - lastMouse.y,
    }

    setStagePos({
      x: stagePos.x + dragDistance.x,
      y: stagePos.y + dragDistance.y,
    })
    setLastMouse(pointerPos)
  }

  const handleStageMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const unscaledX = (pointer.x - stagePos.x) / zoom
    const unscaledY = (pointer.y - stagePos.y) / zoom

    if (
      unscaledX >= 0 &&
      unscaledX <= squareSize.width &&
      unscaledY >= 0 &&
      unscaledY <= squareSize.height
    ) {
      setRelativePos({
        x: Math.round(unscaledX / scalingFactor),
        y: Math.round(unscaledY / scalingFactor),
      });
    } else {
      setRelativePos({ x: 0, y: null });
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only start dragging if not clicking on a point (circle)
    if (e.target.getClassName() === "Circle") {
      return // Don't start dragging when clicking on circles
    }

    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()

    if (pointer) {
      // Check if we're in point placement mode and clicking inside the square
      const unscaledX = (pointer.x - offset.x) / zoom
      const unscaledY = (pointer.y - offset.y) / zoom

      const isInsideSquare =
        unscaledX >= 0 && unscaledX <= squareSize.width && unscaledY >= 0 && unscaledY <= squareSize.height

      // Allow dragging if:
      // 1. We're not in point placement mode (focusPoint is empty), OR
      // 2. We're clicking outside the square
      if (!focusPoint || !isInsideSquare) {
        setIsDragging(true)
        setLastMouse({ x: e.evt.clientX, y: e.evt.clientY })
        e.evt.preventDefault() // Prevent default browser behavior
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  const handleMouseMoveDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isDragging) {
      const dx = e.evt.clientX - lastMouse.x;
      const dy = e.evt.clientY - lastMouse.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMouse({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()
      const scaleBy = 1.1
      const stage = stageRef.current
      const oldScale = zoom
      const pointer = stage!.getPointerPosition()!

      const mousePointTo = {
        x: (pointer.x - stage!.x()) / oldScale,
        y: (pointer.y - stage!.y()) / oldScale,
      }

      const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy

      setZoom(newScale)
      setStagePos({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      })
    },
    [zoom],
  )

  const handlePointClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (action !== "select" || isDragging) return

    e.cancelBubble = true

    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (
      !pointer ||
      !focusNode ||
      squareSize.width === 0 ||
      squareSize.height === 0
    )
      return;

    const unscaledX = (pointer.x - stagePos.x) / zoom
    const unscaledY = (pointer.y - stagePos.y) / zoom

    // Ensure we're within bounds
    if (
      unscaledX < 0 ||
      unscaledX > squareSize.width ||
      unscaledY < 0 ||
      unscaledY > squareSize.height
    )
      return;

    // Only proceed with point placement if we have a focusPoint
    if (focusPoint === "") return

    // Convert to normalized coordinates (0-1)
    const x = unscaledX / squareSize.width;
    const y = unscaledY / squareSize.height;

    if (focusPoint === "Reference Point") {
      setMapBounding((prev) => {
        const newMapBounding = new Map(prev)
        const nodeInfo = newMapBounding.get(focusNode.id)
        if (!nodeInfo) return prev

        newMapBounding.set(focusNode.id, {
          ...nodeInfo,
          referencePosition: [x, y] as [number, number],
        })
        return newMapBounding
      })
    } else {
      setMapBounding((prev) => {
        const newMapBounding = new Map(prev)
        const nodeInfo = newMapBounding.get(focusNode.id)
        if (!nodeInfo) return prev

        const newInterfacePositions = new Map(nodeInfo.interfacePositions)
        newInterfacePositions.set(focusPoint, [x, y] as [number, number])
        newMapBounding.set(focusNode.id, {
          ...nodeInfo,
          interfacePositions: newInterfacePositions,
        })
        return newMapBounding
      })
    }
  };

  const handleCircleClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    position: [number, number]
  ) => {
    // Prevent the stage from starting drag
    e.cancelBubble = true;

    if (focusPoint !== "") {
      if (focusPoint === "Reference Point") {
        setMapBounding((prev) => {
          const newMapBounding = new Map(prev);
          newMapBounding.set(focusNode!.id, {
            ...newMapBounding.get(focusNode!.id)!,
            referencePosition: position,
          });
          return newMapBounding;
        });
      } else {
        setMapBounding((prev) => {
          const newMapBounding = new Map(prev);
          const nodeInfo = newMapBounding.get(focusNode!.id);
          if (nodeInfo) {
            const newInterfacePositions = new Map(nodeInfo.interfacePositions);
            newInterfacePositions.set(focusPoint, position);
            newMapBounding.set(focusNode!.id, {
              ...nodeInfo,
              interfacePositions: newInterfacePositions,
            });
          }
          return newMapBounding;
        });
      }
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 2);
    setZoom(newZoom);
    // Adjust offset to keep center point
    setOffset({
      x: width / 2 - (squareSize.width * newZoom) / 2,
      y: height / 2 - (squareSize.height * newZoom) / 2,
    });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
    // Adjust offset to keep center point
    setOffset({
      x: width / 2 - (squareSize.width * newZoom) / 2,
      y: height / 2 - (squareSize.height * newZoom) / 2,
    });
  };

  const handleReset = () => {
    if (
      width > 0 &&
      height > 0 &&
      squareSize.width > 0 &&
      squareSize.height > 0
    ) {
      const padding = 0.1;
      const maxWidthZoom = (width * (1 - padding)) / squareSize.width;
      const maxHeightZoom = (height * (1 - padding)) / squareSize.height;
      const newZoom = Math.min(maxWidthZoom, maxHeightZoom, 1);

      setZoom(newZoom)
      setStagePos({
        x: (width - squareSize.width * newZoom) / 2,
        y: (height - squareSize.height * newZoom) / 2,
      })
    }
  };

  return (
    <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-background">
      <div className="p-2 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <TooltipProvider>
          
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleReset}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showPoints ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPoints((prev) => !prev)}
                >
                  {showPoints ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showPoints ? "Hide Points" : "Show Points"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={action === "move" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAction(action === "move" ? "select" : "move")}
                >
                  <FaRegHandPaper className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{action === "move" ? "Switch to Select" : "Switch to Move"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Zoom: {(zoom * 100).toFixed(0)}%</span>
          {relativePos.y !== null ? (
            <span>
              Position: ({relativePos.x}, {relativePos.y}) mm
            </span>
          ) : (
            <span>Position: Outside</span>
          )}
          {squareSize.width > 0 && (
            <span>
              Size: {(squareSize.width / scalingFactor).toFixed(1)}mm × {(squareSize.height / scalingFactor).toFixed(1)}
              mm
            </span>
          )}
        </div>
      </div>

      <div
        ref={ref}
        className="relative flex-grow"
        style={{
          cursor: isDragging ? "grabbing" : focusPoint && relativePos.y !== null ? "crosshair" : "grab",
        }}
      >
        {squareSize.width === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Select a node to view and edit its bounding configuration
          </div>
        )}

        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleStageMouseUp}
          onClick={handlePointClick}
          onWheel={handleWheel}
          draggable={action === "move"}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={zoom}
          scaleY={zoom}
          className="bg-[#f8f9fa]"
        >
          <Layer>
            {/* Background grid */}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="rgba(240, 240, 240, 0.5)"
              onMouseDown={handleMouseDown}
              perfectDrawEnabled={false}
            />

            {squareSize.width > 0 && (
              <Rect
                x={0}
                y={0}
                width={squareSize.width}
                height={squareSize.height}
                fill="rgba(220, 240, 255, 0.8)"
                stroke="#2563eb"
                strokeWidth={1}
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={5}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.5}
                onClick={handlePointClick}
                cornerRadius={2}
              />
            )}

            {showPoints &&
              focusNode &&
              (() => {
                const combinedPoints = new Map<
                  string,
                  { x: number; y: number; labels: string[] }
                >();

                // Add reference point
                const referencePosition = mapBounding.get(
                  focusNode.id
                )?.referencePosition;
                if (referencePosition) {
                  const [refX, refY] = referencePosition;
                  const key = `${refX},${refY}`;
                  combinedPoints.set(key, {
                    x: refX,
                    y: refY,
                    labels: ["Reference Point"],
                  });
                }

                // Add interface points
                const interfacePositions = mapBounding.get(
                  focusNode.id
                )?.interfacePositions;
                if (interfacePositions) {
                  interfacePositions.forEach((pos, key) => {
                    const nodeId = focusNode.id;
                    const node = nodesState.nodes.find(
                      (node) => node.id === nodeId
                    );
                    let name = "";

                    if (node?.type === "ObjectNode") {
                      const typeID = node?.data.data.object?.typeId;
                      const interfaces = config.types.find(
                        (type) => type.id === typeID
                      )?.interfaces;
                      if (interfaces) {
                        name =
                          interfaces.find((intf) => intf.id === key)?.name ||
                          "";
                      } else {
                        name = "";
                      }
                    } else if (node?.type === "starter") {
                      name = "Output";
                    } else {
                      name = "Input";
                    }

                    const [intX, intY] = pos;
                    const pointKey = `${intX},${intY}`;
                    if (combinedPoints.has(pointKey)) {
                      combinedPoints.get(pointKey)!.labels.push(name);
                    } else {
                      combinedPoints.set(pointKey, {
                        x: intX,
                        y: intY,
                        labels: [name],
                      });
                    }
                  });
                }

                // Render combined points
                return Array.from(combinedPoints.values()).map(({ x, y, labels }, index) => {
                  const isReferencePoint = labels.includes("Reference Point")
                  return (
                    <React.Fragment key={`${x},${y}`}>
                      <Circle
                        x={x * squareSize.width}
                        y={y * squareSize.height}
                        radius={6 / zoom}
                        fill={isReferencePoint ? "#ef4444" : "#10b981"}
                        stroke="#fff"
                        strokeWidth={2 / zoom}
                        shadowColor="rgba(0,0,0,0.3)"
                        shadowBlur={3 / zoom}
                        shadowOffset={{ x: 1 / zoom, y: 1 / zoom }}
                        shadowOpacity={0.5}
                        onClick={(e) => handleCircleClick(e, [x, y])}
                      />
                      <Text
                        text={`(${Math.round((x * squareSize.width) / scalingFactor)}, ${Math.round((y * squareSize.height) / scalingFactor)}) mm\n${labels.join(", ")}`}
                        x={x * squareSize.width + 10 / zoom}
                        y={y * squareSize.height - 20 / zoom}
                        fontSize={14 / zoom}
                        fontStyle={isReferencePoint ? "bold" : "normal"}
                        fill={isReferencePoint ? "#ef4444" : "#10b981"}
                        padding={4 / zoom}
                        background="rgba(255,255,255,0.8)"
                        cornerRadius={3 / zoom}
                        shadowColor="rgba(0,0,0,0.1)"
                        shadowBlur={2 / zoom}
                        shadowOffset={{ x: 1 / zoom, y: 1 / zoom }}
                      />
                    </React.Fragment>
                  )
                })
              })()}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
