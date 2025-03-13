"use client";

import Konva from "konva";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { EdgeManager } from "./edge-manager";
import { Edge } from "../Class/edge";
import { Table } from "../Class/table";
import { Object } from "../Class/object";

// Mirror size options
const MIRROR_SIZES = [
  { name: "Small", width: 20, height: 20 },
  { name: "Medium", width: 30, height: 30 },
  { name: "Large", width: 40, height: 40 },
  { name: "Rectangle", width: 50, height: 25 },
];

// Mock data for testing
const mockObjects: Object[] = [
  {
    id: "1",
    name: "Laser Generator",
    size: { width: 50, height: 50 },
    position: { x: 0, y: 0 },
    rotation: 0,
    referencePosition: [0.5, 0.5],
    interfacePositions: new Map([["start", [0.5, 0.5]]]),
    isColliding: false,
  },
  {
    id: "2",
    name: "Lens",
    size: { width: 50, height: 50 },
    position: { x: 50, y: 50 },
    rotation: 0,
    referencePosition: [0.5, 0.5],
    interfacePositions: new Map([
      ["1", [0.5, 0.5]],
      ["2", [0.5, 0.5]],
    ]),
    isColliding: false,
  },
  {
    id: "3",
    name: "Detector",
    size: { width: 50, height: 50 },
    position: { x: 100, y: 100 },
    rotation: 0,
    referencePosition: [0.5, 0.5],
    interfacePositions: new Map([["terminal", [0.5, 0.5]]]),
    isColliding: false,
  },
];

// Mock edges for testing
const mockEdges: Edge[] = [
  {
    id: "edge1",
    source: "1",
    sourceInterface: "start",
    target: "2",
    targetInterface: "1",
    expectedDistance: 200,
    actualDistance: 0,
  },
  {
    id: "edge2",
    source: "2",
    sourceInterface: "2",
    target: "3",
    targetInterface: "terminal",
    expectedDistance: 200,
    actualDistance: 0,
  },
];

export default function Canvas() {
  // Container and stage size (screen coordinates)
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 }); // Default size
  const stageRef = useRef<Konva.Stage | null>(null);

  // SCENE COORDINATE APPROACH: Zoom and position state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // Start with some offset

  // Track if we're currently dragging an object
  const [isDraggingObject, setIsDraggingObject] = useState(false);
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);

  // Selected object
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Table and grid (defined in scene coordinates)
  const [table, setTable] = useState<Table>({
    size: { width: 2500, height: 1000 },
    margin: { width: 50, height: 50 },
    gridDistance: 25,
    gridStyle: "dot",
    gridColor: "black",
    gridOpacity: 0.5,
  });

  // Snap grid points (in scene coordinates)
  const [snapPoints, setSnapPoints] = useState<{ x: number; y: number }[]>([]);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [snapThreshold, setSnapThreshold] = useState(10); // in screen pixels

  // Debug state
  const [debug, setDebug] = useState({
    isStageVisible: false,
    containerSize: { width: 0, height: 0 },
    error: null as string | null,
  });

  // Use mock data for objects and edges
  const [objects, setObjects] = useState<Object[]>(mockObjects);
  const [edges, setEdges] = useState<Edge[]>(mockEdges);

  // Calculate actual distances for edges when objects change
  useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const sourcePos = getInterfacePosition(
          edge.source,
          edge.sourceInterface
        );
        const targetPos = getInterfacePosition(
          edge.target,
          edge.targetInterface
        );

        if (!sourcePos || !targetPos) return edge;

        const distance = calculateManhattanDistance(sourcePos, targetPos);

        return {
          ...edge,
          actualDistance: distance,
        };
      })
    );
  }, [objects]);

  // Edge management functions
  const handleEdgeUpdate = (updatedEdge: Edge) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => (edge.id === updatedEdge.id ? updatedEdge : edge))
    );
  };

  const handleEdgeDelete = (edgeId: string) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  };

  const handleEdgeAdd = (newEdge: Edge) => {
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

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

  // Add keyboard event listener for rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" && selectedObjectId) {
        rotateObject(selectedObjectId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObjectId]);

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

  // Calculate object's bounding box considering rotation
  const getObjectBoundingBox = (object: Object) => {
    const { position, size, rotation, referencePosition } = object;

    // Calculate the reference point
    const refX = referencePosition[0] * size.width;
    const refY = referencePosition[1] * size.height;

    // Create a temporary Konva.Rect to calculate the rotated bounds
    const tempRect = new Konva.Rect({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      rotation: rotation,
      offset: { x: refX, y: refY },
    });

    // Get the bounding box
    const box = tempRect.getClientRect();

    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    };
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

  // Rotate an object by 90 degrees clockwise
  const rotateObject = (objectId: string) => {
    const object = objects.find((obj) => obj.id === objectId);
    if (!object) return;

    const newRotation = (object.rotation + 90) % 360;

    // Apply rotation without checking for collisions
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === objectId ? { ...obj, rotation: newRotation } : obj
      )
    );
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

  // Determine the appropriate interface position based on the edge direction
  const determineInterfacePosition = (
    cornerPosition: { x: number; y: number },
    edge: Edge
  ): [number, number] => {
    // Get the source and target positions
    const sourcePos = getInterfacePosition(edge.source, edge.sourceInterface);
    const targetPos = getInterfacePosition(edge.target, edge.targetInterface);

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
    const sourcePos = getInterfacePosition(edge.source, edge.sourceInterface);
    const targetPos = getInterfacePosition(edge.target, edge.targetInterface);
    if (!sourcePos || !targetPos) return;

    // Determine the appropriate interface position based on the edge direction
    const interfacePosition = determineInterfacePosition(position, edge);

    // Default mirror size (Medium)
    const mirrorWidth = 30;
    const mirrorHeight = 30;

    // Calculate the reference point offset
    const refX = 0.5 * mirrorWidth;
    const refY = 0.5 * mirrorHeight;

    // Calculate the interface point offset from the reference point
    const interfaceX = interfacePosition[0] * mirrorWidth;
    const interfaceY = interfacePosition[1] * mirrorHeight;

    // Calculate the mirror position so that the interface point is exactly at the corner position
    const mirrorObject: Object = {
      id: mirrorId,
      name: "Mirror",
      size: { width: mirrorWidth, height: mirrorHeight },
      position: {
        x: position.x - interfaceX + refX,
        y: position.y - interfaceY + refY,
      },
      rotation: 0,
      referencePosition: [0.5, 0.5], // Center of the object
      interfacePositions: new Map([["in", interfacePosition]]),
      isColliding: false,
      isMirror: true,
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

  // Change the size of a mirror
  const changeMirrorSize = (mirrorId: string, sizeIndex: number) => {
    const size = MIRROR_SIZES[sizeIndex];
    if (!size) return;

    const mirror = objects.find((obj) => obj.id === mirrorId);
    if (!mirror || !mirror.isMirror) return;

    // Get the current interface position in absolute coordinates
    const interfacePos = getInterfacePosition(mirrorId, "in");
    if (!interfacePos) return;

    // Get the interface position ratio
    const interfaceRatio = mirror.interfacePositions.get("in");
    if (!interfaceRatio) return;

    // Calculate the reference point offset
    const oldRefX = mirror.referencePosition[0] * mirror.size.width;
    const oldRefY = mirror.referencePosition[0] * mirror.size.height;

    // Calculate the new reference point offset
    const newRefX = mirror.referencePosition[0] * size.width;
    const newRefY = mirror.referencePosition[0] * size.height;

    // Calculate the interface point offset from the reference point in the new size
    const newInterfaceX = interfaceRatio[0] * size.width;
    const newInterfaceY = interfaceRatio[1] * size.height;

    // Calculate the new position to keep the interface point at the same absolute position
    const newPosition = {
      x: interfacePos.x - newInterfaceX + newRefX,
      y: interfacePos.y - newInterfaceY + newRefY,
    };

    // Update the object with the new size and position
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === mirrorId
          ? {
              ...obj,
              size: { width: size.width, height: size.height },
              position: newPosition,
            }
          : obj
      )
    );
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
        />
        {gridRender()}
      </>
    );
  };

  // Handle mirror deletion
  const handleMirrorDelete = (mirrorId: string) => {
    // Find the mirror object
    const mirror = objects.find((obj) => obj.id === mirrorId && obj.isMirror);
    if (!mirror) return;

    // Find all edges connected to this mirror
    const incomingEdges = edges.filter((edge) => edge.target === mirrorId);
    const outgoingEdges = edges.filter((edge) => edge.source === mirrorId);

    // If we have exactly one incoming and one outgoing edge, reconnect them
    if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
      const incomingEdge = incomingEdges[0];
      const outgoingEdge = outgoingEdges[0];

      // Create a new edge connecting the original source and target
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: incomingEdge.source,
        sourceInterface: incomingEdge.sourceInterface,
        target: outgoingEdge.target,
        targetInterface: outgoingEdge.targetInterface,
        expectedDistance:
          incomingEdge.expectedDistance + outgoingEdge.expectedDistance,
        actualDistance: 0,
      };

      // Update edges: remove the two connected edges and add the new one
      setEdges((prevEdges) => [
        ...prevEdges.filter(
          (e) => e.id !== incomingEdge.id && e.id !== outgoingEdge.id
        ),
        newEdge,
      ]);
    } else {
      // If the mirror has other connections, just remove the edges connected to it
      setEdges((prevEdges) =>
        prevEdges.filter((e) => e.source !== mirrorId && e.target !== mirrorId)
      );
    }

    // Remove the mirror object
    setObjects((prevObjects) =>
      prevObjects.filter((obj) => obj.id !== mirrorId)
    );

    // If the deleted mirror was selected, clear selection
    if (selectedObjectId === mirrorId) {
      setSelectedObjectId(null);
    }
  };

  // Render object
  const objectRender = (object: Object) => {
    const refX = object.referencePosition[0] * object.size.width;
    const refY = object.referencePosition[1] * object.size.height;
    const isSelected = selectedObjectId === object.id;

    // Determine fill color based on collision, selection state, and object type
    let fillColor = "grey";
    if (object.isColliding) {
      fillColor = "red";
    } else if (isSelected) {
      fillColor = "#8888FF";
    } else if (object.isMirror) {
      fillColor = "#FFA500"; // Orange for mirrors
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

            <Text
              text="Mirror"
              x={-15}
              y={-25}
              width={object.size.width + 30}
              height={20}
              align="center"
              verticalAlign="middle"
              fontSize={10 / scale}
              fill="black"
            />

            <Circle
              x={object.size.width / 2 + 15}
              y={-object.size.height / 2 - 5}
              radius={8 / scale}
              fill="red"
              opacity={0.8}
              onClick={(e) => {
                e.cancelBubble = true; // Stop event propagation
                handleMirrorDelete(object.id);
              }}
              onTap={(e) => {
                e.cancelBubble = true; // Stop event propagation
                handleMirrorDelete(object.id);
              }}
            />

            <Text
              text="×"
              x={object.size.width / 2 + 10}
              y={-object.size.height / 2 - 12}
              fontSize={14 / scale}
              fill="white"
              align="center"
              verticalAlign="middle"
              width={10}
              height={14}
              listening={false}
            />
          </>
        ) : (
          // Render regular object
          <>
            <Rect
              width={object.size.width}
              height={object.size.height}
              fill={fillColor}
              cornerRadius={3}
              opacity={0.4}
              stroke={isSelected ? "blue" : "transparent"}
              strokeWidth={1 / scale}
            />
            <Text
              text={object.name}
              x={0}
              y={0}
              width={object.size.width}
              height={object.size.height}
              align="center"
              verticalAlign="middle"
              fontSize={12 / scale}
              fill="black"
            />
          </>
        )}

        <Circle
          x={refX}
          y={refY}
          radius={2 / scale} // Adjust size based on zoom
          fill="red"
        />

        {Array.from(object.interfacePositions).map(([intf, position]) => (
          <Group key={intf}>
            <Circle
              x={position[0] * object.size.width}
              y={position[1] * object.size.height}
              radius={3 / scale} // Adjust size based on zoom
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

  // Get interface position in scene coordinates
  const getInterfacePosition = (objectId: string, interfaceId: string) => {
    const object = objects.find((obj) => obj.id === objectId);
    if (!object) return null;

    const interfacePosition = object.interfacePositions.get(interfaceId);
    if (!interfacePosition) return null;

    const refX = object.referencePosition[0] * object.size.width;
    const refY = object.referencePosition[1] * object.size.height;

    const objectX = object.position.x;
    const objectY = object.position.y;
    const objectRotation = object.rotation;

    const interfaceX = interfacePosition[0] * object.size.width;
    const interfaceY = interfacePosition[1] * object.size.height;

    // Rotate the interface position around the object's reference point
    const angleInRadians = (objectRotation * Math.PI) / 180;
    const rotatedX =
      Math.cos(angleInRadians) * (interfaceX - refX) -
      Math.sin(angleInRadians) * (interfaceY - refY) +
      refX;
    const rotatedY =
      Math.sin(angleInRadians) * (interfaceX - refX) +
      Math.cos(angleInRadians) * (interfaceY - refY) +
      refY;

    return {
      x: objectX + rotatedX - refX,
      y: objectY + rotatedY - refY,
    };
  };

  // Calculate Manhattan distance between two points
  const calculateManhattanDistance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) => {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  };

  // Generate orthogonal path points between two interface points
  const generateOrthogonalPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    // Check if either end is connected to a mirror
    const isMirrorInterface = (pos: { x: number; y: number }) => {
      return objects.some((obj) => {
        if (!obj.isMirror) return false;

        const interfacePos = getInterfacePosition(obj.id, "in");
        if (!interfacePos) return false;

        return (
          Math.abs(interfacePos.x - pos.x) < 5 &&
          Math.abs(interfacePos.y - pos.y) < 5
        );
      });
    };

    const startIsMirror = isMirrorInterface(start);
    const endIsMirror = isMirrorInterface(end);

    // Always use orthogonal paths, even with mirrors
    // Option 1: Vertical first, then horizontal
    const path1 = [start.x, start.y, start.x, end.y, end.x, end.y];

    // Option 2: Horizontal first, then vertical
    const path2 = [start.x, start.y, end.x, start.y, end.x, end.y];

    // Get all mirror objects to avoid their bounding boxes
    const mirrors = objects.filter((obj) => obj.isMirror);
    const mirrorBoxes = mirrors.map((mirror) => getObjectBoundingBox(mirror));

    // Check if a path segment intersects with any mirror bounding box
    const intersectsWithMirror = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      return mirrorBoxes.some((box) => {
        // Simple line-rectangle intersection check
        // For vertical lines
        if (x1 === x2) {
          const minY = Math.min(y1, y2);
          const maxY = Math.max(y1, y2);
          return (
            x1 >= box.x &&
            x1 <= box.x + box.width &&
            maxY >= box.y &&
            minY <= box.y + box.height
          );
        }
        // For horizontal lines
        if (y1 === y2) {
          const minX = Math.min(x1, x2);
          const maxX = Math.max(x1, x2);
          return (
            y1 >= box.y &&
            y1 <= box.y + box.height &&
            maxX >= box.x &&
            minX <= box.x + box.width
          );
        }
        return false;
      });
    };

    // Check if paths intersect with mirrors
    const path1Intersects =
      intersectsWithMirror(path1[0], path1[1], path1[2], path1[3]) ||
      intersectsWithMirror(path1[2], path1[3], path1[4], path1[5]);

    const path2Intersects =
      intersectsWithMirror(path2[0], path2[1], path2[2], path2[3]) ||
      intersectsWithMirror(path2[2], path2[3], path2[4], path2[5]);

    // If neither path intersects, choose the shorter one
    if (!path1Intersects && !path2Intersects) {
      // Prefer vertical first as default
      return path1;
    }

    // If only one path doesn't intersect, use that one
    if (!path1Intersects) return path1;
    if (!path2Intersects) return path2;

    // If both paths intersect, try a more complex path with two turns
    const offset = 30; // Offset distance to go around objects
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // If horizontal distance is greater, go vertical first with offset
      const offsetY = dy > 0 ? start.y - offset : start.y + offset;
      const path3 = [
        start.x,
        start.y,
        start.x,
        offsetY,
        end.x,
        offsetY,
        end.x,
        end.y,
      ];

      const path3Intersects =
        intersectsWithMirror(path3[0], path3[1], path3[2], path3[3]) ||
        intersectsWithMirror(path3[2], path3[3], path3[4], path3[5]) ||
        intersectsWithMirror(path3[4], path3[5], path3[6], path3[7]);

      if (!path3Intersects) return path3;
    } else {
      // If vertical distance is greater, go horizontal first with offset
      const offsetX = dx > 0 ? start.x - offset : start.x + offset;
      const path3 = [
        start.x,
        start.y,
        offsetX,
        start.y,
        offsetX,
        end.y,
        end.x,
        end.y,
      ];

      const path3Intersects =
        intersectsWithMirror(path3[0], path3[1], path3[2], path3[3]) ||
        intersectsWithMirror(path3[2], path3[3], path3[4], path3[5]) ||
        intersectsWithMirror(path3[4], path3[5], path3[6], path3[7]);

      if (!path3Intersects) return path3;
    }

    // If all else fails, use the original path (vertical first)
    return path1;
  };

  // Render edges between objects
  const edgeRender = () => {
    return edges.map((edge) => {
      const sourcePos = getInterfacePosition(edge.source, edge.sourceInterface);
      const targetPos = getInterfacePosition(edge.target, edge.targetInterface);

      if (!sourcePos || !targetPos) return null;

      // Generate orthogonal path
      const pathPoints = generateOrthogonalPath(sourcePos, targetPos);

      // Determine color based on distance comparison
      const distanceDifference = Math.abs(
        edge.actualDistance - edge.expectedDistance
      );
      const isDistanceMatching = distanceDifference < 5;
      const strokeColor = isDistanceMatching ? "green" : "red";

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
            strokeWidth={1.5 / scale}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={`${Math.round(edge.actualDistance)}/${edge.expectedDistance}`}
            x={(sourcePos.x + targetPos.x) / 2}
            y={(sourcePos.y + targetPos.y) / 2 - 15 / scale}
            fontSize={10 / scale}
            fill={strokeColor}
            align="center"
          />
          {/* Clickable corner points to add mirrors */}
          {cornerPositions.map((corner, index) => (
            <Circle
              key={`corner-${index}`}
              x={corner.x}
              y={corner.y}
              radius={5 / scale}
              fill="transparent"
              stroke="blue"
              strokeWidth={1 / scale}
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

  // Reset view to fit all objects
  const resetView = () => {
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

  // Check if selected object is a mirror
  const isSelectedMirror = () => {
    if (!selectedObjectId) return false;
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    return selectedObject?.isMirror === true;
  };

  // Get current mirror size index
  const getCurrentMirrorSizeIndex = () => {
    if (!selectedObjectId) return 1; // Default to Medium
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    if (!selectedObject?.isMirror) return 1;

    const { width, height } = selectedObject.size;
    return (
      MIRROR_SIZES.findIndex(
        (size) => size.width === width && size.height === height
      ) || 1
    );
  };

  // Add debug UI to visualize and control snap settings
  const DebugUI = () => (
    <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-md z-10 max-w-xs">
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => setSnapEnabled(e.target.checked)}
            className="mr-2"
          />
          Snap to Grid
        </label>
      </div>
      <div className="mt-2">
        <label>
          Snap Threshold: {snapThreshold}px
          <input
            type="range"
            min="1"
            max="50"
            value={snapThreshold}
            onChange={(e) => setSnapThreshold(Number.parseInt(e.target.value))}
            className="w-full mt-1"
          />
        </label>
      </div>
      <div className="mt-2">
        <div>Zoom: {scale.toFixed(2)}x</div>
        <div>Selected: {selectedObjectId || "None"}</div>
      </div>

      {/* Mirror size selector (only shown when a mirror is selected) */}
      {isSelectedMirror() && (
        <div className="mt-2">
          <label>
            Mirror Size:
            <select
              className="w-full p-1 mt-1 text-sm"
              value={getCurrentMirrorSizeIndex()}
              onChange={(e) =>
                changeMirrorSize(selectedObjectId!, Number(e.target.value))
              }
            >
              {MIRROR_SIZES.map((size, index) => (
                <option key={index} value={index}>
                  {size.name} ({size.width}x{size.height})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="mt-2 flex space-x-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => selectedObjectId && rotateObject(selectedObjectId)}
          disabled={!selectedObjectId}
        >
          Rotate 90°
        </button>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={resetView}
        >
          Reset View
        </button>
      </div>

      {/* Edge Manager */}
      <div className="mt-4">
        <EdgeManager
          edges={edges}
          onEdgeUpdate={handleEdgeUpdate}
          onEdgeDelete={handleEdgeDelete}
          onEdgeAdd={handleEdgeAdd}
          objects={objects}
        />
      </div>

      <div className="mt-2 text-xs">
        <div>Stage visible: {debug.isStageVisible ? "Yes" : "No"}</div>
        <div>
          Container: {debug.containerSize.width}x{debug.containerSize.height}
        </div>
        {debug.error && (
          <div className="text-red-500">Error: {debug.error}</div>
        )}
      </div>
    </div>
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

      {/* Debug UI */}
      <DebugUI />
    </div>
  );
}
