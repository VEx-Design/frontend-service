"use client"

import Konva from "konva"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva"

interface Table {
  size: { width: number; height: number } // unit in mm (scene coordinates)
  margin: { width: number; height: number } // unit in mm (scene coordinates)
  gridDistance: number // unit in mm (scene coordinates)
  gridStyle: "dot" | "line" // grid style
  gridColor: string // grid color
  gridOpacity: number // grid opacity
}

interface Object {
  id: string // object id
  name: string // object name
  size: { width: number; height: number } // unit in mm (scene coordinates)
  position: { x: number; y: number } // position in scene coordinates
  rotation: number // rotation in degrees
  referencePosition: [number, number] // unit in ratio
  interfacePositions: Map<string, [number, number]> // Map<interface, position> unit in ratio
  isColliding?: boolean // Flag to indicate if object is colliding
}

interface Edge {
  id: string
  source: string
  sourceInterface: string
  target: string
  targetInterface: string
  expectedDistance: number
  actualDistance: number
}

export default function KonvaPage() {
  // Container and stage size (screen coordinates)
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 }) // Default size
  const stageRef = useRef<Konva.Stage | null>(null)

  // SCENE COORDINATE APPROACH: Zoom and position state
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 100, y: 100 }) // Start with some offset

  // Track if we're currently dragging an object
  const [isDraggingObject, setIsDraggingObject] = useState(false)
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null)

  // Selected object
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)

  // Table and grid (defined in scene coordinates)
  const [table, setTable] = useState<Table>({
    size: { width: 2500, height: 1000 },
    margin: { width: 50, height: 50 },
    gridDistance: 25,
    gridStyle: "dot",
    gridColor: "black",
    gridOpacity: 0.5,
  })

  // Snap grid points (in scene coordinates)
  const [snapPoints, setSnapPoints] = useState<{ x: number; y: number }[]>([])
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [snapThreshold, setSnapThreshold] = useState(10) // in screen pixels

  // Debug state
  const [debug, setDebug] = useState({
    isStageVisible: false,
    containerSize: { width: 0, height: 0 },
    error: null as string | null,
  })

  // Objects (defined in scene coordinates)
  const [objects, setObjects] = useState<Object[]>([
    {
      id: "1",
      name: "Object 1",
      size: { width: 100, height: 100 },
      position: { x: 100, y: 100 }, // Initial position in scene coordinates
      rotation: 0, // Initial rotation in degrees
      referencePosition: [0, 0], // Center
      interfacePositions: new Map([
        ["1", [0, 0.5]],
        ["2", [1, 0.5]],
      ]),
      isColliding: false,
    },
    {
      id: "2",
      name: "Object 2",
      size: { width: 150, height: 80 },
      position: { x: 300, y: 300 }, // Initial position in scene coordinates
      rotation: 0, // Initial rotation in degrees
      referencePosition: [0.5, 0.5], // Center
      interfacePositions: new Map([
        ["1", [0, 0.5]],
        ["2", [1, 0.5]],
      ]),
      isColliding: false,
    },
  ])

  // Get the size of the container to set the stage size
  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Set initial size
      const { offsetWidth, offsetHeight } = containerRef.current
      setStageSize({ width: offsetWidth, height: offsetHeight })
      setDebug((prev) => ({
        ...prev,
        containerSize: { width: offsetWidth, height: offsetHeight },
      }))

      const resizeObserver = new ResizeObserver((entries) => {
        try {
          const { width, height } = entries[0].contentRect
          setStageSize({ width, height })
          setDebug((prev) => ({
            ...prev,
            containerSize: { width, height },
          }))
        } catch (err) {
          setDebug((prev) => ({ ...prev, error: err instanceof Error ? err.message : String(err) }))
        }
      })

      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    } catch (err) {
      setDebug((prev) => ({ ...prev, error: err instanceof Error ? err.message : String(err) }))
    }
  }, [])

  // Check if stage is visible
  useEffect(() => {
    if (stageRef.current) {
      setDebug((prev) => ({ ...prev, isStageVisible: true }))
    }
  }, [stageRef.current])

  // Add keyboard event listener for rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" && selectedObjectId) {
        rotateObject(selectedObjectId)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedObjectId])

  // Generate snap points in scene coordinates
  useEffect(() => {
    const points: { x: number; y: number }[] = []
    for (let x = table.margin.width; x <= table.size.width - table.margin.width; x += table.gridDistance) {
      for (let y = table.margin.height; y <= table.size.height - table.margin.height; y += table.gridDistance) {
        points.push({ x, y })
      }
    }

    setSnapPoints(points)
  }, [table.margin.width, table.margin.height, table.size.width, table.size.height, table.gridDistance])

  // Check for collisions whenever objects change
  useEffect(() => {
    // Skip collision check during drag to avoid UI flicker
    if (isDraggingObject) return

    // Reset all collision flags
    const updatedObjects = objects.map((obj) => ({ ...obj, isColliding: false }))

    // Check each pair of objects for collisions
    for (let i = 0; i < updatedObjects.length; i++) {
      for (let j = i + 1; j < updatedObjects.length; j++) {
        if (checkCollision(updatedObjects[i], updatedObjects[j])) {
          updatedObjects[i].isColliding = true
          updatedObjects[j].isColliding = true
        }
      }
    }

    // Update state if any collision flags changed
    if (updatedObjects.some((obj, idx) => obj.isColliding !== objects[idx].isColliding)) {
      setObjects(updatedObjects)
    }
  }, [objects, isDraggingObject])

  // SCENE COORDINATE APPROACH: Coordinate conversion functions

  // Convert screen to scene coordinates
  const screenToScene = (screenX: number, screenY: number) => {
    return {
      x: (screenX - position.x) / scale,
      y: (screenY - position.y) / scale,
    }
  }

  // Convert scene to screen coordinates
  const sceneToScreen = (sceneX: number, sceneY: number) => {
    return {
      x: sceneX * scale + position.x,
      y: sceneY * scale + position.y,
    }
  }

  // SCENE COORDINATE APPROACH: Zoom handling
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = e.target.getStage()
    if (!stage) return

    const oldScale = scale

    // Get pointer position in screen coordinates
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    // Convert to scene coordinates
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    }

    // Calculate new scale
    const scaleBy = 1.1
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

    // Limit scale if needed
    const limitedScale = Math.max(0.1, Math.min(5, newScale))

    // Calculate new position to zoom toward mouse
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    }

    // Update state
    setScale(limitedScale)
    setPosition(newPos)
  }

  // Find the closest grid point to a given scene position
  const findClosestGridPoint = (scenePos: { x: number; y: number }) => {
    // Calculate the closest grid point based on the grid distance
    const gridX =
      Math.round((scenePos.x - table.margin.width) / table.gridDistance) * table.gridDistance + table.margin.width
    const gridY =
      Math.round((scenePos.y - table.margin.height) / table.gridDistance) * table.gridDistance + table.margin.height

    return { x: gridX, y: gridY }
  }

  // SCENE COORDINATE APPROACH: Snap to grid function
  const snapToGrid = (scenePos: { x: number; y: number }) => {
    if (!snapEnabled) return scenePos

    // Find the closest grid point
    const closestPoint = findClosestGridPoint(scenePos)

    // Calculate distance in scene coordinates
    const dx = scenePos.x - closestPoint.x
    const dy = scenePos.y - closestPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Convert snap threshold from screen pixels to scene units
    const sceneThreshold = snapThreshold / scale

    // Snap if within threshold
    if (distance <= sceneThreshold) {
      return closestPoint
    }

    return scenePos
  }

  // Calculate object's bounding box considering rotation
  const getObjectBoundingBox = (object: Object) => {
    const { position, size, rotation, referencePosition } = object

    // Calculate the reference point
    const refX = referencePosition[0] * size.width
    const refY = referencePosition[1] * size.height

    // Create a temporary Konva.Rect to calculate the rotated bounds
    const tempRect = new Konva.Rect({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      rotation: rotation,
      offset: { x: refX, y: refY },
    })

    // Get the bounding box
    const box = tempRect.getClientRect()

    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    }
  }

  // Check if two objects collide
  const checkCollision = (obj1: Object, obj2: Object) => {
    const box1 = getObjectBoundingBox(obj1)
    const box2 = getObjectBoundingBox(obj2)

    // Check for intersection
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    )
  }

  // Check if an object would collide with any other object at a given position and rotation
  const wouldCollide = (objectId: string, newPosition: { x: number; y: number }, newRotation?: number) => {
    const currentObject = objects.find((obj) => obj.id === objectId)
    if (!currentObject) return false

    // Create a temporary object with the new position and rotation
    const tempObject = {
      ...currentObject,
      position: newPosition,
      rotation: newRotation !== undefined ? newRotation : currentObject.rotation,
    }

    // Check for collisions with all other objects
    return objects.some((obj) => {
      if (obj.id === objectId) return false // Skip self
      return checkCollision(tempObject, obj)
    })
  }

  // Rotate an object by 90 degrees clockwise
  const rotateObject = (objectId: string) => {
    const object = objects.find((obj) => obj.id === objectId)
    if (!object) return

    const newRotation = (object.rotation + 90) % 360

    // Check if rotation would cause a collision
    if (wouldCollide(objectId, object.position, newRotation)) {
      // If it would cause a collision, don't rotate
      return
    }

    setObjects((prevObjects) =>
      prevObjects.map((obj) => (obj.id === objectId ? { ...obj, rotation: newRotation } : obj)),
    )
  }

  // SCENE COORDINATE APPROACH: Handle object drag start
  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
    // Mark that we're dragging an object to prevent stage dragging
    setIsDraggingObject(true)
    setDraggedObjectId(objectId)

    // Disable stage dragging while dragging an object
    if (stageRef.current) {
      stageRef.current.draggable(false)
    }
  }

  // SCENE COORDINATE APPROACH: Handle object drag move
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
    const shape = e.target

    // Get the object being dragged
    const object = objects.find((obj) => obj.id === objectId)
    if (!object) return

    // Calculate the reference point position in scene coordinates
    const refX = object.referencePosition[0] * object.size.width
    const refY = object.referencePosition[1] * object.size.height

    // Get the current position of the shape
    const currentX = shape.x()
    const currentY = shape.y()

    // If snap is enabled, we need to snap the reference point to the grid
    if (snapEnabled) {
      // Calculate the absolute position of the reference point in scene coordinates
      // For Konva, the position is already the position of the reference point because
      // we're using offsetX and offsetY in the Group to set the reference point as the origin
      const refPointScenePos = {
        x: currentX,
        y: currentY,
      }

      // Get snapped position for the reference point
      const snappedScenePos = snapToGrid(refPointScenePos)

      // Calculate the new position for the group
      const newX = snappedScenePos.x
      const newY = snappedScenePos.y

      // Check for collisions at the new position
      if (wouldCollide(objectId, { x: newX, y: newY })) {
        // If there would be a collision, update the collision state
        setObjects((prevObjects) =>
          prevObjects.map((obj) => (obj.id === objectId ? { ...obj, isColliding: true } : obj)),
        )
        return
      }

      // No collision, reset collision state and apply the new position
      setObjects((prevObjects) =>
        prevObjects.map((obj) => (obj.id === objectId ? { ...obj, isColliding: false } : obj)),
      )

      // Apply the new position
      shape.x(newX)
      shape.y(newY)
    } else {
      // No snapping, just check for collisions
      if (wouldCollide(objectId, { x: currentX, y: currentY })) {
        setObjects((prevObjects) =>
          prevObjects.map((obj) => (obj.id === objectId ? { ...obj, isColliding: true } : obj)),
        )
      } else {
        setObjects((prevObjects) =>
          prevObjects.map((obj) => (obj.id === objectId ? { ...obj, isColliding: false } : obj)),
        )
      }
    }
  }

  // Handle object drag end
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
    const shape = e.target

    // Update the object position in state
    setObjects((prevObjects) =>
      prevObjects.map((obj) => (obj.id === objectId ? { ...obj, position: { x: shape.x(), y: shape.y() } } : obj)),
    )

    // Mark that we're no longer dragging an object
    setIsDraggingObject(false)
    setDraggedObjectId(null)

    // Re-enable stage dragging
    if (stageRef.current) {
      stageRef.current.draggable(true)
    }
  }

  // Handle object selection
  const handleSelect = (objectId: string) => {
    setSelectedObjectId(objectId === selectedObjectId ? null : objectId)
  }

  // SCENE COORDINATE APPROACH: Generate grid lines/dots
  const gridRender = () => {
    const { size, margin, gridDistance, gridStyle, gridColor, gridOpacity } = table
    const gridElements: React.JSX.Element[] = []

    // Calculate visible area in scene coordinates
    const stage = containerRef.current?.querySelector("div.konvajs-content canvas")
    if (!stage) return gridElements

    // Get stage dimensions
    const stageWidth = stageSize.width
    const stageHeight = stageSize.height

    // Calculate visible area in scene coordinates
    const topLeft = screenToScene(0, 0)
    const bottomRight = screenToScene(stageWidth, stageHeight)

    // Calculate grid start and end points (only render visible grid)
    const startX = Math.max(margin.width, Math.floor(topLeft.x / gridDistance) * gridDistance)
    const endX = Math.min(size.width - margin.width, Math.ceil(bottomRight.x / gridDistance) * gridDistance)
    const startY = Math.max(margin.height, Math.floor(topLeft.y / gridDistance) * gridDistance)
    const endY = Math.min(size.height - margin.height, Math.ceil(bottomRight.y / gridDistance) * gridDistance)

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
            />,
          )
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
          />,
        )
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
          />,
        )
      }
    }

    return gridElements
  }

  // Render table
  const tableRender = () => {
    return (
      <>
        <Rect width={table.size.width} height={table.size.height} fill="white" cornerRadius={3} />
        {gridRender()}
      </>
    )
  }

  // Render object
  const objectRender = (object: Object) => {
    const refX = object.referencePosition[0] * object.size.width
    const refY = object.referencePosition[1] * object.size.height
    const isSelected = selectedObjectId === object.id

    // Determine fill color based on collision and selection state
    let fillColor = "grey"
    if (object.isColliding) {
      fillColor = "red"
    } else if (isSelected) {
      fillColor = "#8888FF"
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
        <Circle
          x={refX}
          y={refY}
          radius={2 / scale} // Adjust size based on zoom
          fill="red"
        />
        {Array.from(object.interfacePositions).map(([intf, position]) => (
          <Circle
            key={intf}
            x={position[0] * object.size.width}
            y={position[1] * object.size.height}
            radius={2 / scale} // Adjust size based on zoom
            fill="blue"
          />
        ))}
      </Group>
    )
  }

  // Handle stage drag end
  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Only update stage position if we're not dragging an object
    if (!isDraggingObject) {
      const stage = e.target
      setPosition({
        x: stage.x(),
        y: stage.y(),
      })
    }
  }

  // Add debug UI to visualize and control snap settings
  const DebugUI = () => (
    <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-md z-10">
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
      <div className="mt-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          onClick={() => selectedObjectId && rotateObject(selectedObjectId)}
          disabled={!selectedObjectId}
        >
          Rotate 90°
        </button>
      </div>
      <div className="mt-2 text-xs">
        <div>Stage visible: {debug.isStageVisible ? "Yes" : "No"}</div>
        <div>
          Container: {debug.containerSize.width}x{debug.containerSize.height}
        </div>
        {debug.error && <div className="text-red-500">Error: {debug.error}</div>}
      </div>
    </div>
  )

  return (
    <div
      ref={containerRef}
      style={
        {
          width: "100%",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        } as React.CSSProperties
      }
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
              setSelectedObjectId(null)
            }
          }}
        >
          <Layer>
            {/* Table Render */}
            {tableRender()}

            {/* Object Render */}
            {objects.map((object) => objectRender(object))}
          </Layer>
        </Stage>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Stage size is zero. Container: {debug.containerSize.width}x{debug.containerSize.height}
        </div>
      )}

      {/* Debug UI */}
      <DebugUI />
    </div>
  )
}

