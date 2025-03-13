"use client";

import type Konva from "konva";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Group,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Image as KonvaImage,
} from "react-konva";
import type { Table } from "../Class/table";
import type { Edge } from "../Class/edge";
import type { Object } from "../Class/object";
import { useCanvas } from "@/features/systems/contexts/CanvasContext";
import type { Mirror } from "../Class/mirror";
import {
  calculateManhattanDistance,
  generateOrthogonalPath,
  getInterfacePosition,
  getObjectBoundingBox,
} from "./edge-routing";
import { Camera, Eye, EyeOff, RefreshCw, RotateCw } from "lucide-react";

// Extended Object type to include image rotation
type ExtendedObject = Object & {
  imageRotation?: number;
};

export default function Canvas() {
  // Container and stage size (screen coordinates)
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  // Stage size (screen coordinates)
  const { stageSize, setStageSize } = useCanvas() as {
    stageSize: { width: number; height: number };
    setStageSize: React.Dispatch<
      React.SetStateAction<{ width: number; height: number }>
    >;
  };

  // Table and grid (defined in scene coordinates)
  const { table, setTable } = useCanvas() as {
    table: Table;
    setTable: React.Dispatch<React.SetStateAction<Table>>;
  };
  const { objects, setObjects } = useCanvas() as {
    objects: ExtendedObject[];
    setObjects: React.Dispatch<React.SetStateAction<ExtendedObject[]>>;
  };
  const { edges, setEdges } = useCanvas() as {
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  };
  const { mirrors } = useCanvas() as { mirrors: Mirror[] };
  const { defaultMirror } = useCanvas() as { defaultMirror: number };

  // SCENE COORDINATE APPROACH: Zoom and position state
  const { scale, setScale } = useCanvas();
  const { position, setPosition } = useCanvas();

  // Selected object
  const { selectedObjectId, setSelectedObjectId } = useCanvas();

  // Snap grid points (in scene coordinates)
  const { snapPoints, setSnapPoints } = useCanvas();
  const { snapEnabled, setSnapEnabled } = useCanvas();
  const { snapThreshold, setSnapThreshold } = useCanvas();

  // Track if we're currently dragging an object
  const [isDraggingObject, setIsDraggingObject] = useState(false);
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);

  // Store loaded images
  const [loadedImages, setLoadedImages] = useState<
    Record<string, HTMLImageElement>
  >({});

  //State for showing name, bounding box, reference points, interface points, and expected distance
  const [showObjectNames, setShowObjectNames] = useState(false);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showExpectedDistance, setShowExpectedDistance] = useState(true);
  const [showReferencePoints, setShowReferencePoints] = useState(true);
  const [showInterfacePoints, setShowInterfacePoints] = useState(false);
  const [showCornerPoints, setShowCornerPoints] = useState(true);
  const [showActualDistance, setShowActualDistance] = useState(true);
  const [showImages, setShowImages] = useState(true);

  // Debug state
  const [debug, setDebug] = useState({
    isStageVisible: false,
    containerSize: { width: 0, height: 0 },
    error: null as string | null,
  });

  // Load images for objects with imageUrl
  useEffect(() => {
    objects.forEach((obj) => {
      if (obj.imageUrl && !loadedImages[obj.id]) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = obj.imageUrl;
        img.onload = () => {
          setLoadedImages((prev) => ({
            ...prev,
            [obj.id]: img,
          }));
        };
      }
    });
  }, [objects]);

  // Calculate actual distances for edges when objects change
  useEffect(() => {
    setEdges((prevEdges: Edge[]) => {
      return prevEdges.map((edge) => {
        const sourcePos = getInterfacePosition(
          objects,
          edge.source,
          edge.sourceInterface
        );
        const targetPos = getInterfacePosition(
          objects,
          edge.target,
          edge.targetInterface
        );

        if (!sourcePos || !targetPos) return edge;

        const distance = calculateManhattanDistance(sourcePos, targetPos);

        return {
          ...edge,
          actualDistance: distance,
        };
      });
    });
  }, [objects]);

  // Get the size of the container to set the stage size
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Set initial size
      const { offsetWidth, offsetHeight } = containerRef.current;
      setStageSize({ width: offsetWidth, height: offsetHeight });
      setDebug((prev) => ({
        ...prev,
        containerSize: { width: offsetWidth, height: offsetHeight },
      }));

      const resizeObserver = new ResizeObserver((entries) => {
        try {
          const { width, height } = entries[0].contentRect;
          setStageSize({ width, height });
          setDebug((prev) => ({
            ...prev,
            containerSize: { width, height },
          }));
        } catch (err) {
          setDebug((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : String(err),
          }));
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    } catch (err) {
      setDebug((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }, []);

  // Check if stage is visible
  useEffect(() => {
    if (stageRef.current) {
      setDebug((prev) => ({ ...prev, isStageVisible: true }));
    }
  }, [stageRef.current]);

  // Generate snap points in scene coordinates
  useEffect(() => {
    const points: { x: number; y: number }[] = [];
    for (
      let x = table.margin.width;
      x <= table.size.width - table.margin.width;
      x += table.gridDistance
    ) {
      for (
        let y = table.margin.height;
        y <= table.size.height - table.margin.height;
        y += table.gridDistance
      ) {
        points.push({ x, y });
      }
    }

    setSnapPoints(points);
  }, [
    table.margin.width,
    table.margin.height,
    table.size.width,
    table.size.height,
    table.gridDistance,
  ]);

  // Check for collisions whenever objects change
  useEffect(() => {
    // Skip collision check during drag to avoid UI flicker
    if (isDraggingObject) return;

    // Reset all collision flags
    const updatedObjects = objects.map((obj) => ({
      ...obj,
      isColliding: false,
    }));

    // Check each pair of objects for collisions
    for (let i = 0; i < updatedObjects.length; i++) {
      for (let j = i + 1; j < updatedObjects.length; j++) {
        if (checkCollision(updatedObjects[i], updatedObjects[j])) {
          updatedObjects[i].isColliding = true;
          updatedObjects[j].isColliding = true;
        }
      }
    }

    // Update state if any collision flags changed
    if (
      updatedObjects.some(
        (obj, idx) => obj.isColliding !== objects[idx].isColliding
      )
    ) {
      setObjects(updatedObjects);
    }
  }, [objects, isDraggingObject]);

  // SCENE COORDINATE APPROACH: Coordinate conversion functions

  // Convert screen to scene coordinates
  const screenToScene = (screenX: number, screenY: number) => {
    return {
      x: (screenX - position.x) / scale,
      y: (screenY - position.y) / scale,
    };
  };

  // Convert scene to screen coordinates
  const sceneToScreen = (sceneX: number, sceneY: number) => {
    return {
      x: sceneX * scale + position.x,
      y: sceneY * scale + position.y,
    };
  };

  // SCENE COORDINATE APPROACH: Zoom handling
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = scale;

    // Get pointer position in screen coordinates
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Convert to scene coordinates
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    // Calculate new scale
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Limit scale if needed
    const limitedScale = Math.max(0.1, Math.min(5, newScale));

    // Calculate new position to zoom toward mouse
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };

    // Update state
    setScale(limitedScale);
    setPosition(newPos);
  };

  // Find the closest grid point to a given scene position
  const findClosestGridPoint = (scenePos: { x: number; y: number }) => {
    // Calculate the closest grid point based on the grid distance
    const gridX =
      Math.round((scenePos.x - table.margin.width) / table.gridDistance) *
        table.gridDistance +
      table.margin.width;
    const gridY =
      Math.round((scenePos.y - table.margin.height) / table.gridDistance) *
        table.gridDistance +
      table.margin.height;

    return { x: gridX, y: gridY };
  };

  // SCENE COORDINATE APPROACH: Snap to grid function
  const snapToGrid = (scenePos: { x: number; y: number }) => {
    if (!snapEnabled) return scenePos;

    // Find the closest grid point
    const closestPoint = findClosestGridPoint(scenePos);

    // Calculate distance in scene coordinates
    const dx = scenePos.x - closestPoint.x;
    const dy = scenePos.y - closestPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Convert snap threshold from screen pixels to scene units
    const sceneThreshold = snapThreshold / scale;

    // Snap if within threshold
    if (distance <= sceneThreshold) {
      return closestPoint;
    }

    return scenePos;
  };

  // Check if two objects collide
  const checkCollision = (obj1: Object, obj2: Object) => {
    const box1 = getObjectBoundingBox(obj1);
    const box2 = getObjectBoundingBox(obj2);

    // Check for intersection
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  };

  // Check if an object would collide with any other object at a given position and rotation
  const wouldCollide = (
    objectId: string,
    newPosition: { x: number; y: number },
    newRotation?: number
  ) => {
    const currentObject = objects.find((obj) => obj.id === objectId);
    if (!currentObject) return false;

    // Create a temporary object with the new position and rotation
    const tempObject = {
      ...currentObject,
      position: newPosition,
      rotation:
        newRotation !== undefined ? newRotation : currentObject.rotation,
    };

    // Check for collisions with all other objects
    return objects.some((obj) => {
      if (obj.id === objectId) return false; // Skip self
      return checkCollision(tempObject, obj);
    });
  };

  // SCENE COORDINATE APPROACH: Handle object drag start
  const handleDragStart = (
    e: Konva.KonvaEventObject<DragEvent>,
    objectId: string
  ) => {
    // Mark that we're dragging an object to prevent stage dragging
    setIsDraggingObject(true);
    setDraggedObjectId(objectId);

    // Disable stage dragging while dragging an object
    if (stageRef.current) {
      stageRef.current.draggable(false);
    }
  };

  // SCENE COORDINATE APPROACH: Handle object drag move
  const handleDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    objectId: string
  ) => {
    const shape = e.target;

    // Get the object being dragged
    const object = objects.find((obj) => obj.id === objectId);
    if (!object) return;

    // Calculate the reference point position in scene coordinates
    const refX = object.referencePosition[0] * object.size.width;
    const refY = object.referencePosition[1] * object.size.height;

    // Get the current position of the shape
    const currentX = shape.x();
    const currentY = shape.y();

    // If snap is enabled, we need to snap the reference point to the grid
    if (snapEnabled) {
      // Calculate the absolute position of the reference point in scene coordinates
      // For Konva, the position is already the position of the reference point because
      // we're using offsetX and offsetY in the Group to set the reference point as the origin
      const refPointScenePos = {
        x: currentX,
        y: currentY,
      };

      // Get snapped position for the reference point
      const snappedScenePos = snapToGrid(refPointScenePos);

      // Calculate the new position for the group
      const newX = snappedScenePos.x;
      const newY = snappedScenePos.y;

      // Check for collisions at the new position
      if (wouldCollide(objectId, { x: newX, y: newY })) {
        // If there would be a collision, update the collision state
        setObjects((prevObjects) =>
          prevObjects.map((obj) =>
            obj.id === objectId ? { ...obj, isColliding: true } : obj
          )
        );
        return;
      }

      // No collision, reset collision state and apply the new position
      setObjects((prevObjects) =>
        prevObjects.map((obj) =>
          obj.id === objectId ? { ...obj, isColliding: false } : obj
        )
      );

      // Apply the new position
      shape.x(newX);
      shape.y(newY);
    } else {
      // No snapping, just check for collisions
      if (wouldCollide(objectId, { x: currentX, y: currentY })) {
        setObjects((prevObjects) =>
          prevObjects.map((obj) =>
            obj.id === objectId ? { ...obj, isColliding: true } : obj
          )
        );
      } else {
        setObjects((prevObjects) =>
          prevObjects.map((obj) =>
            obj.id === objectId ? { ...obj, isColliding: false } : obj
          )
        );
      }
    }
  };

  // Handle object drag end
  const handleDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    objectId: string
  ) => {
    const shape = e.target;

    // Update the object position in state
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === objectId
          ? { ...obj, position: { x: shape.x(), y: shape.y() } }
          : obj
      )
    );

    // Mark that we're no longer dragging an object
    setIsDraggingObject(false);
    setDraggedObjectId(null);

    // Re-enable stage dragging
    if (stageRef.current) {
      stageRef.current.draggable(true);
    }
  };

  // Handle object selection
  const handleSelect = (objectId: string) => {
    setSelectedObjectId(objectId === selectedObjectId ? null : objectId);
  };

  // Rotate the image inside a mirror
  const rotateImageInMirror = () => {
    if (selectedObjectId) {
      const object = objects.find((obj) => obj.id === selectedObjectId);
      if (!object || !object.isMirror) return;

      // Calculate new rotation (add 45 degrees each time)
      const currentRotation = object.imageRotation || 45;
      const newRotation = (currentRotation + 45) % 360;

      // Update the object with the new image rotation
      setObjects((prevObjects) =>
        prevObjects.map((obj) =>
          obj.id === selectedObjectId
            ? { ...obj, imageRotation: newRotation }
            : obj
        )
      );
    }
  };

  // Determine the appropriate interface position based on the edge direction
  const determineInterfacePosition = (
    cornerPosition: { x: number; y: number },
    edge: Edge
  ): [number, number] => {
    // Get the source and target positions
    const sourcePos = getInterfacePosition(
      objects,
      edge.source,
      edge.sourceInterface
    );
    const targetPos = getInterfacePosition(
      objects,
      edge.target,
      edge.targetInterface
    );

    if (!sourcePos || !targetPos) return [0.25, 0.25]; // Default to top-left if we can't determine

    // Determine the direction of the edge at the corner
    // For an L-shaped path, we need to check which direction the edge is coming from and going to

    // If the corner is at the same x as the source, the edge is coming from above/below
    // If the corner is at the same y as the source, the edge is coming from left/right
    const isVerticalFirst = cornerPosition.x === sourcePos.x;

    if (isVerticalFirst) {
      // Edge is vertical first, then horizontal
      if (cornerPosition.y > sourcePos.y) {
        // Coming from above, going right/left
        return cornerPosition.x < targetPos.x ? [0.75, 0.25] : [0.25, 0.25]; // Top-right or Top-left
      } else {
        // Coming from below, going right/left
        return cornerPosition.x < targetPos.x ? [0.75, 0.75] : [0.25, 0.75]; // Bottom-right or Bottom-left
      }
    } else {
      // Edge is horizontal first, then vertical
      if (cornerPosition.x > sourcePos.x) {
        // Coming from left, going up/down
        return cornerPosition.y < targetPos.y ? [0.25, 0.75] : [0.25, 0.25]; // Bottom-left or Top-left
      } else {
        // Coming from right, going up/down
        return cornerPosition.y < targetPos.y ? [0.75, 0.75] : [0.75, 0.25]; // Bottom-right or Top-right
      }
    }
  };

  // Create a mirror object at the specified position
  const createMirrorObject = (
    position: { x: number; y: number },
    edgeId: string
  ) => {
    // Generate a unique ID for the mirror
    const mirrorId = `mirror-${Date.now()}`;

    // Find the edge that was clicked
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;

    // Get source and target positions
    const sourcePos = getInterfacePosition(
      objects,
      edge.source,
      edge.sourceInterface
    );
    const targetPos = getInterfacePosition(
      objects,
      edge.target,
      edge.targetInterface
    );
    if (!sourcePos || !targetPos) return;

    // Determine the appropriate interface position based on the edge direction
    const interfacePosition = determineInterfacePosition(position, edge);

    // Default mirror size
    const { width: mirrorWidth, height: mirrorHeight } = mirrors[defaultMirror];

    // Calculate the reference point offset
    const refX = 0.5 * mirrorWidth;
    const refY = 0.5 * mirrorHeight;

    // Calculate the interface point offset from the reference point
    const interfaceX = interfacePosition[0] * mirrorWidth;
    const interfaceY = interfacePosition[1] * mirrorHeight;

    // Calculate the mirror position so that the interface point is exactly at the corner position
    const mirrorObject: ExtendedObject = {
      id: mirrorId,
      name: "Mirror",
      size: { width: mirrorWidth, height: mirrorHeight },
      position: {
        x: position.x - interfaceX + refX,
        y: position.y - interfaceY + refY,
      },
      rotation: 0,
      imageRotation: 45, // Default image rotation to 45 degrees to align with diamond
      referencePosition: [0.5, 0.5], // Center of the object
      interfacePositions: new Map([["in", interfacePosition]]),
      isColliding: false,
      isMirror: true,
      imageUrl: mirrors[defaultMirror].imageUrl,
    };

    // Add the mirror object to the objects array
    setObjects((prevObjects) => [...prevObjects, mirrorObject]);

    // Calculate the actual distances for the two segments
    const sourceToCornerDistance =
      Math.abs(sourcePos.x - position.x) + Math.abs(sourcePos.y - position.y);
    const cornerToTargetDistance =
      Math.abs(position.x - targetPos.x) + Math.abs(position.y - targetPos.y);
    const totalDistance = sourceToCornerDistance + cornerToTargetDistance;

    // Calculate the expected distances proportionally
    const sourceToCornerExpected = Math.round(
      (sourceToCornerDistance / totalDistance) * edge.expectedDistance
    );
    const cornerToTargetExpected =
      edge.expectedDistance - sourceToCornerExpected;

    // Create two new edges to replace the original edge
    // First edge: from source to mirror
    const edge1: Edge = {
      id: `edge-${Date.now()}-1`,
      source: edge.source,
      sourceInterface: edge.sourceInterface,
      target: mirrorId,
      targetInterface: "in",
      expectedDistance: sourceToCornerExpected,
      actualDistance: 0,
    };

    // Second edge: from mirror to target
    const edge2: Edge = {
      id: `edge-${Date.now()}-2`,
      source: mirrorId,
      sourceInterface: "in",
      target: edge.target,
      targetInterface: edge.targetInterface,
      expectedDistance: cornerToTargetExpected,
      actualDistance: 0,
    };

    // Replace the original edge with the two new edges
    setEdges((prevEdges) => [
      ...prevEdges.filter((e) => e.id !== edgeId),
      edge1,
      edge2,
    ]);
  };

  // Handle click on edge corner
  const handleEdgeCornerClick = (
    edgeId: string,
    cornerPosition: { x: number; y: number }
  ) => {
    // Create a mirror object at the corner position
    createMirrorObject(cornerPosition, edgeId);
  };

  // SCENE COORDINATE APPROACH: Generate grid lines/dots
  const gridRender = () => {
    const { size, margin, gridDistance, gridStyle, gridColor, gridOpacity } =
      table;
    const gridElements: React.JSX.Element[] = [];

    // Calculate visible area in scene coordinates
    const stage = containerRef.current?.querySelector(
      "div.konvajs-content canvas"
    );
    if (!stage) return gridElements;

    // Get stage dimensions
    const stageWidth = stageSize.width;
    const stageHeight = stageSize.height;

    // Calculate visible area in scene coordinates
    const topLeft = screenToScene(0, 0);
    const bottomRight = screenToScene(stageWidth, stageHeight);

    // Calculate grid start and end points (only render visible grid)
    const startX = Math.max(
      margin.width,
      Math.floor(topLeft.x / gridDistance) * gridDistance
    );
    const endX = Math.min(
      size.width - margin.width,
      Math.ceil(bottomRight.x / gridDistance) * gridDistance
    );
    const startY = Math.max(
      margin.height,
      Math.floor(topLeft.y / gridDistance) * gridDistance
    );
    const endY = Math.min(
      size.height - margin.height,
      Math.ceil(bottomRight.y / gridDistance) * gridDistance
    );

    if (gridStyle === "dot") {
      // Render dots
      for (let x = startX; x <= endX; x += gridDistance) {
        for (let y = startY; y <= endY; y += gridDistance) {
          gridElements.push(
            <Circle
              key={`dot-${x}-${y}`}
              x={x}
              y={y}
              radius={1 / scale} // Adjust size based on zoom
              fill={gridColor}
              opacity={gridOpacity}
            />
          );
        }
      }
    } else if (gridStyle === "line") {
      // Render vertical lines
      for (let x = startX; x <= endX; x += gridDistance) {
        gridElements.push(
          <Line
            key={`v-${x}`}
            points={[x, startY, x, endY]}
            stroke={gridColor}
            opacity={gridOpacity}
            strokeWidth={0.5 / scale} // Adjust line width based on zoom
          />
        );
      }

      // Render horizontal lines
      for (let y = startY; y <= endY; y += gridDistance) {
        gridElements.push(
          <Line
            key={`h-${y}`}
            points={[startX, y, endX, y]}
            stroke={gridColor}
            opacity={gridOpacity}
            strokeWidth={0.5 / scale} // Adjust line width based on zoom
          />
        );
      }
    }

    return gridElements;
  };

  // Render table
  const tableRender = () => {
    return (
      <>
        <Rect
          width={table.size.width}
          height={table.size.height}
          fill="white"
          cornerRadius={3}
          onMouseDown={(e) => {
            e.evt.stopPropagation();
            setSelectedObjectId(null);
          }} // Prevent object selection
        />
        {gridRender()}
      </>
    );
  };

  // Render object
  const objectRender = (object: ExtendedObject) => {
    const refX = object.referencePosition[0] * object.size.width;
    const refY = object.referencePosition[1] * object.size.height;
    const isSelected = selectedObjectId === object.id;
    const hasImage = showImages && object.imageUrl && loadedImages[object.id];

    // Determine fill color based on collision, selection state, and object type
    let fillColor = "grey";
    if (object.isColliding) {
      fillColor = "red";
    } else if (isSelected) {
      fillColor = "#8888FF";
    } else if (object.isMirror) {
      fillColor = "#808080";
    }

    return (
      <Group
        key={object.id}
        x={object.position.x}
        y={object.position.y}
        rotation={object.rotation}
        offsetX={refX}
        offsetY={refY}
        draggable
        onClick={() => handleSelect(object.id)}
        onTap={() => handleSelect(object.id)}
        onDragStart={(e) => handleDragStart(e, object.id)}
        onDragMove={(e) => handleDragMove(e, object.id)}
        onDragEnd={(e) => handleDragEnd(e, object.id)}
      >
        {object.isMirror ? (
          // Render mirror as a diamond shape with delete button
          <>
            {/* Draw a diamond shape */}
            {showBoundingBox && (
              <Line
                points={[
                  object.size.width / 2,
                  0, // top
                  object.size.width,
                  object.size.height / 2, // right
                  object.size.width / 2,
                  object.size.height, // bottom
                  0,
                  object.size.height / 2, // left
                ]}
                closed={true}
                fill={fillColor}
                opacity={0.6}
                stroke={isSelected ? "blue" : "transparent"}
                strokeWidth={1 / scale}
              />
            )}

            {/* Image inside mirror with 80% fit, aligned with interface point */}
            {showImages && hasImage && object.interfacePositions.has("in") && (
              <Group>
                {(() => {
                  // Calculate diamond dimensions
                  const diamondWidth = object.size.width;
                  const diamondHeight = object.size.height;

                  // Calculate image size to fit diamond (about 65% of diamond size)
                  const imgWidth = diamondWidth * 0.65;
                  const imgHeight = diamondHeight * 0.65;

                  // Get the image rotation (default to 45 if not set)
                  const imageRotation = object.imageRotation || 45;

                  return (
                    <KonvaImage
                      image={loadedImages[object.id]}
                      width={imgWidth}
                      height={imgHeight}
                      // Position in center of diamond
                      x={diamondWidth / 2}
                      y={diamondHeight / 2}
                      // Center the image
                      offsetX={imgWidth / 2}
                      offsetY={imgHeight / 2}
                      // Apply the image-specific rotation
                      rotation={imageRotation}
                      opacity={0.9}
                      // Clip the image to the diamond shape
                      clipFunc={(ctx: CanvasRenderingContext2D) => {
                        ctx.beginPath();
                        ctx.moveTo(diamondWidth / 2, 0);
                        ctx.lineTo(diamondWidth, diamondHeight / 2);
                        ctx.lineTo(diamondWidth / 2, diamondHeight);
                        ctx.lineTo(0, diamondHeight / 2);
                        ctx.closePath();
                      }}
                    />
                  );
                })()}
              </Group>
            )}
          </>
        ) : (
          // Render regular object
          <>
            {/* Base rectangle */}
            <Rect
              width={object.size.width}
              height={object.size.height}
              fill={showBoundingBox ? fillColor : "transparent"}
              cornerRadius={3}
              opacity={0.4}
              stroke={isSelected ? "blue" : "transparent"}
              strokeWidth={1 / scale}
            />

            {/* Image if available */}
            {hasImage && (
              <KonvaImage
                image={loadedImages[object.id]}
                width={Math.min(
                  object.size.width,
                  loadedImages[object.id]?.width || 1
                )}
                height={Math.min(
                  object.size.height,
                  loadedImages[object.id]?.height || 1
                )}
                x={
                  (object.size.width -
                    Math.min(
                      object.size.width,
                      loadedImages[object.id]?.width || 1
                    )) /
                  2
                }
                y={
                  (object.size.height -
                    Math.min(
                      object.size.height,
                      loadedImages[object.id]?.height || 1
                    )) /
                  2
                }
                opacity={1}
              />
            )}

            {/* Object name */}
            {showObjectNames && (
              <Text
                text={object.name}
                x={0}
                y={0}
                width={object.size.width}
                height={object.size.height}
                align="center"
                verticalAlign="middle"
                fontSize={12 / scale}
                fill={hasImage ? "white" : "black"}
                shadowColor={hasImage ? "black" : undefined}
                shadowBlur={hasImage ? 2 : 0}
                shadowOpacity={hasImage ? 0.8 : 0}
              />
            )}
          </>
        )}

        {showReferencePoints && (
          <Circle x={refX} y={refY} radius={2 / scale} fill="red" />
        )}

        {showInterfacePoints &&
          Array.from(object.interfacePositions).map(([intf, position]) => (
            <Group key={intf}>
              <Circle
                x={position[0] * object.size.width}
                y={position[1] * object.size.height}
                radius={3 / scale}
                fill="blue"
              />
              {!object.isMirror && (
                <Text
                  text={intf}
                  x={position[0] * object.size.width - 15 / scale}
                  y={position[1] * object.size.height - 15 / scale}
                  fontSize={8 / scale}
                  fill="black"
                  width={30 / scale}
                  align="center"
                />
              )}
              {object.isMirror && (
                <Text
                  text={intf}
                  x={position[0] * object.size.width - 10 / scale}
                  y={position[1] * object.size.height - 10 / scale}
                  fontSize={8 / scale}
                  fill="black"
                  width={20 / scale}
                  align="center"
                />
              )}
            </Group>
          ))}
      </Group>
    );
  };

  // Render edges between objects
  const edgeRender = () => {
    return edges.map((edge) => {
      const sourcePos = getInterfacePosition(
        objects,
        edge.source,
        edge.sourceInterface
      );
      const targetPos = getInterfacePosition(
        objects,
        edge.target,
        edge.targetInterface
      );

      if (!sourcePos || !targetPos) return null;

      // Generate orthogonal path
      const pathPoints = generateOrthogonalPath(objects, sourcePos, targetPos);

      // Determine color based on distance comparison
      const distanceDifference = Math.abs(
        edge.actualDistance - edge.expectedDistance
      );
      const isDistanceMatching = distanceDifference == 0;
      const strokeColor = showExpectedDistance
        ? isDistanceMatching
          ? "green"
          : "gray"
        : "red";

      // Calculate corner positions (where the edge bends)
      const cornerPositions = [];
      for (let i = 2; i < pathPoints.length - 2; i += 2) {
        cornerPositions.push({ x: pathPoints[i], y: pathPoints[i + 1] });
      }

      return (
        <Group key={edge.id}>
          <Line
            points={pathPoints}
            stroke={strokeColor}
            strokeWidth={2 / scale}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={`${
              showActualDistance ? Math.round(edge.actualDistance) : ""
            }${showActualDistance && showExpectedDistance ? "/" : ""}${
              showExpectedDistance ? edge.expectedDistance : ""
            }`}
            x={(sourcePos.x + targetPos.x) / 2}
            y={(sourcePos.y + targetPos.y) / 2 - 15 / scale}
            fontSize={10 / scale}
            fill={strokeColor}
            align="center"
          />
          {/* Clickable corner points to add mirrors */}
          {showCornerPoints &&
            cornerPositions.map((corner, index) => (
              <Circle
                key={`corner-${index}`}
                x={corner.x}
                y={corner.y}
                radius={5 / scale}
                fill="transparent"
                stroke="black"
                strokeWidth={3 / scale}
                opacity={0.6}
                onClick={() => handleEdgeCornerClick(edge.id, corner)}
                onTap={() => handleEdgeCornerClick(edge.id, corner)}
              />
            ))}
        </Group>
      );
    });
  };

  // Handle stage drag end
  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Only update stage position if we're not dragging an object
    if (!isDraggingObject) {
      const stage = e.target;
      setPosition({
        x: stage.x(),
        y: stage.y(),
      });
    }
  };

  // Update the CanvasFooter component to add collapsible visibility controls
  // Replace the existing CanvasFooter function with this updated version:

  const CanvasFooter = () => {
    const [visibilityExpanded, setVisibilityExpanded] = useState(false);

    const handleResetView = () => {
      // Calculate bounding box of all objects
      if (objects.length === 0) return;

      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;

      objects.forEach((obj) => {
        const box = getObjectBoundingBox(obj);
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
      });

      // Add padding
      const padding = 100;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;

      // Calculate scale to fit
      const scaleX = stageSize.width / (maxX - minX);
      const scaleY = stageSize.height / (maxY - minY);
      const newScale = Math.min(scaleX, scaleY, 1); // Limit max scale to 1

      // Calculate position
      const newPos = {
        x: stageSize.width / 2 - ((minX + maxX) / 2) * newScale,
        y: stageSize.height / 2 - ((minY + maxY) / 2) * newScale,
      };

      setScale(newScale);
      setPosition(newPos);
    };

    const handleRotate = () => {
      if (selectedObjectId) {
        const object = objects.find((obj) => obj.id === selectedObjectId);
        if (!object) return;

        const newRotation = (object.rotation + 90) % 360;

        // Apply rotation without checking for collisions
        setObjects((prevObjects) =>
          prevObjects.map((obj) =>
            obj.id === selectedObjectId
              ? { ...obj, rotation: newRotation }
              : obj
          )
        );
      }
    };

    const handleSavePicture = () => {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
        const link = document.createElement("a");
        link.download = "picture.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    // Toggle all visibility options on or off
    const toggleAll = (value: boolean) => {
      setShowObjectNames(value);
      setShowBoundingBox(value);
      setShowExpectedDistance(value);
      setShowReferencePoints(value);
      setShowInterfacePoints(value);
      setShowCornerPoints(value);
      setShowActualDistance(value);
      setShowImages(value);
    };

    // Check if the selected object is a mirror
    const selectedObject = selectedObjectId
      ? objects.find((obj) => obj.id === selectedObjectId)
      : null;
    const isSelectedMirror = selectedObject?.isMirror || false;

    return (
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 bg-white p-3 rounded-lg shadow-lg">
        {/* Main toolbar */}
        <div className="flex space-x-3 justify-center">
          <button
            onClick={handleResetView}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset View
          </button>

          <button
            onClick={handleRotate}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
              selectedObjectId
                ? "bg-gray-100 hover:bg-gray-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
            title="Rotate Selected Object"
            disabled={!selectedObjectId}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate Object
          </button>

          {/* Add button to rotate image inside mirror */}
          <button
            onClick={rotateImageInMirror}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
              isSelectedMirror
                ? "bg-gray-100 hover:bg-gray-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
            title="Rotate Image Inside Mirror"
            disabled={!isSelectedMirror}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate Image
          </button>

          <button
            onClick={handleSavePicture}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Save as Image"
          >
            <Camera className="w-4 h-4 mr-2" />
            Save Image
          </button>
        </div>

        {/* Visibility controls header with toggle */}
        <div className="border-t pt-2 mt-1">
          <button
            onClick={() => setVisibilityExpanded(!visibilityExpanded)}
            className="flex w-full justify-between items-center text-xs font-medium text-gray-600 hover:bg-gray-50 rounded px-1 py-0.5"
          >
            <span>Visibility Controls</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${
                visibilityExpanded ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Visibility controls content */}
          {visibilityExpanded && (
            <>
              <div className="flex justify-end mt-1 mb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAll(true)}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Show All
                  </button>
                  <button
                    onClick={() => toggleAll(false)}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Hide All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <VisibilityToggle
                  label="Name"
                  state={showObjectNames}
                  setState={setShowObjectNames}
                />
                <VisibilityToggle
                  label="Bounding"
                  state={showBoundingBox}
                  setState={setShowBoundingBox}
                />
                <VisibilityToggle
                  label="Actual Distance"
                  state={showActualDistance}
                  setState={setShowActualDistance}
                />
                <VisibilityToggle
                  label="Expected Distanace"
                  state={showExpectedDistance}
                  setState={setShowExpectedDistance}
                />

                <VisibilityToggle
                  label="Reference Point"
                  state={showReferencePoints}
                  setState={setShowReferencePoints}
                />
                <VisibilityToggle
                  label="Interface Point"
                  state={showInterfacePoints}
                  setState={setShowInterfacePoints}
                />
                <VisibilityToggle
                  label="Corner Point"
                  state={showCornerPoints}
                  setState={setShowCornerPoints}
                />
                <VisibilityToggle
                  label="Image"
                  state={showImages}
                  setState={setShowImages}
                  icon={
                    showImages ? (
                      <Eye className="w-3 h-3 mr-1" />
                    ) : (
                      <EyeOff className="w-3 h-3 mr-1" />
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Add a new VisibilityToggle component for the improved toolbar
  const VisibilityToggle = ({
    label,
    state,
    setState,
    icon,
  }: {
    label: string;
    state: boolean;
    setState: (state: boolean) => void;
    icon?: React.ReactNode;
  }) => (
    <button
      onClick={() => setState(!state)}
      className={`flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded transition-colors ${
        state
          ? "bg-gray-300 text-black hover:bg-gray-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      title={`${state ? "Hide" : "Show"} ${label}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {stageSize.width > 0 && stageSize.height > 0 ? (
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          scale={{ x: scale, y: scale }}
          position={position}
          onWheel={handleWheel}
          draggable={!isDraggingObject}
          onDragEnd={handleStageDragEnd}
          className="bg-gray-200"
          onMouseDown={(e) => {
            // If we clicked on the stage itself (not on an object)
            if (e.target === e.target.getStage()) {
              setSelectedObjectId(null);
            }
          }}
        >
          <Layer>
            {/* Table Render */}
            {tableRender()}

            {/* Edge Render */}
            {edgeRender()}

            {/* Object Render */}
            {objects.map((object) => objectRender(object))}
          </Layer>
        </Stage>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Stage size is zero. Container: {debug.containerSize.width}x
          {debug.containerSize.height}
        </div>
      )}
      <CanvasFooter />
    </div>
  );
}
