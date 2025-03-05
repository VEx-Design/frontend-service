"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Stage, Layer, Line, Circle, Image as KonvaImage, Group, Rect, Text } from "react-konva"
import { useCanvas } from "./CanvasContext"
import useImage from "use-image"
import type Konva from "konva"
import { FaRegHandPaper } from "react-icons/fa"
import { AiOutlineExport } from "react-icons/ai"
import { RxBox } from "react-icons/rx"
import { LuMousePointer2 } from "react-icons/lu"
import { MdRotate90DegreesCcw } from "react-icons/md"
import { calculateOrthogonalPath } from "./edgeRouting"

// At the top of the file, add this interface definition and export it
export interface EdgeData {
  id: string
  source: string
  sourceHandle: string
  target: string
  targetHandle: string
  distance: number
}

interface KonvaObjectProps {
  id: string
  x: number
  y: number
  width: number
  height: number
  imageUrl: string
  name: string
  isSelected: boolean
  onSelect: () => void
  onChange: (newProps: { x: number; y: number; rotation?: number }) => void
  draggable: boolean
  allObjects: Array<{
    id: string
    x: string | number
    y: string | number
    width: number
    height: number
    rotation?: number
  }>
  referencePosition: [number, number]
  rotation: number
  gridSize: number
  showGrid: boolean
  gridStyle: "dot" | "line"
  interfacePositions?: Map<string, [number, number]>
  showBoundingBox: boolean
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
  rotation = 0,
  gridSize,
  showGrid,
  gridStyle,
  interfacePositions,
  showBoundingBox,
}) => {
  const [image] = useImage(imageUrl, "anonymous")
  const [isColliding, setIsColliding] = useState(false)

  const circleSize = Math.min(width, height) * 0.8
  const circleX = width / 2
  const circleY = height / 2

  const checkCollision = useCallback(
    (currentX: number, currentY: number) => {
      return allObjects.some((obj) => {
        if (obj.id === id) return false

        // Simple rectangular collision detection
        const isOverlapping =
          Number(currentX) < Number(obj.x) + obj.width &&
          Number(currentX) + width > Number(obj.x) &&
          Number(currentY) < Number(obj.y) + obj.height &&
          Number(currentY) + height > Number(obj.y)

        return isOverlapping
      })
    },
    [id, width, height, allObjects],
  )

  useEffect(() => {
    setIsColliding(checkCollision(Number(x), Number(y)))
  }, [x, y, checkCollision])

  // Calculate reference point coordinates
  const getReferencePointCoordinates = (objX: number, objY: number) => {
    const refX = objX + width * referencePosition[0]
    const refY = objY + height * referencePosition[1]
    return { refX, refY }
  }

  // Function to snap to grid dots
  const snapToGrid = (objX: number, objY: number) => {
    if (!showGrid || gridStyle !== "dot") return { x: objX, y: objY }

    const { refX, refY } = getReferencePointCoordinates(objX, objY)

    // Calculate the closest grid point
    const snapX = Math.round(refX / gridSize) * gridSize
    const snapY = Math.round(refY / gridSize) * gridSize

    // Adjust position to align reference point with the grid
    const newX = objX + (snapX - refX)
    const newY = objY + (snapY - refY)

    return { x: newX, y: newY }
  }

  // Render interface points based on rotation
  const renderInterfacePoints = () => {
    if (!interfacePositions || !isSelected) return null

    return Array.from(interfacePositions.entries()).map(([interfaceId, position]) => {
      // Calculate rotated position
      const [relX, relY] = position
      const interfaceX = width * relX
      const interfaceY = height * relY

      return (
        <Circle
          key={interfaceId}
          x={interfaceX}
          y={interfaceY}
          radius={4}
          fill="#10b981"
          stroke="#fff"
          strokeWidth={1}
        />
      )
    })
  }

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onClick={onSelect}
      onDragMove={(e) => {
        const newX = e.target.x()
        const newY = e.target.y()
        setIsColliding(checkCollision(newX, newY))
      }}
      onDragEnd={(e) => {
        let newX = e.target.x()
        let newY = e.target.y()

        // Apply snapping when drag ends
        if (showGrid && gridStyle === "dot") {
          const snapped = snapToGrid(newX, newY)
          newX = snapped.x
          newY = snapped.y

          // Update the position on the stage
          e.target.position({ x: newX, y: newY })
        }

        onChange({
          x: newX,
          y: newY,
          rotation,
        })
      }}
    >
      <Group
        rotation={rotation}
        offsetX={width * referencePosition[0]}
        offsetY={height * referencePosition[1]}
        x={width * referencePosition[0]}
        y={height * referencePosition[1]}
      >
        {/* Background Rectangle */}
        <Rect
          width={width}
          height={height}
          fill={isColliding ? "rgba(255, 0, 0, 0.5)" : "white"}
          stroke={isSelected || showBoundingBox ? "#ddd" : "transparent"}
          strokeWidth={isSelected ? 2 : 1}
          cornerRadius={5}
        />

        {/* Circular Clipping Area */}
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath()
            ctx.arc(circleX, circleY, circleSize / 2, 0, Math.PI * 2, false)
            ctx.closePath()
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
        <Circle x={circleX} y={circleY} radius={circleSize / 2} stroke="#ddd" strokeWidth={1} />

        {/* Reference Point Indicator (visible when selected) */}
        {isSelected && (
          <Circle
            x={width * referencePosition[0]}
            y={height * referencePosition[1]}
            radius={5}
            fill="#ff0000"
            stroke="#ffffff"
            strokeWidth={1}
            opacity={1}
          />
        )}

        {/* Interface Points */}
        {renderInterfacePoints()}
      </Group>
    </Group>
  )
}

interface EdgeProps {
  id: string
  source: string
  sourceHandle: string
  target: string
  targetHandle: string
  distance: number
  objects: Array<{
    id: string
    x: string | number
    y: string | number
    width: number
    height: number
    rotation?: number
    referencePosition: [number, number]
    interfacePositions?: Map<string, [number, number]>
  }>
  isSelected: boolean
  onSelect: () => void
}

const Edge: React.FC<EdgeProps> = ({
  source,
  sourceHandle,
  target,
  targetHandle,
  distance,
  objects,
  isSelected,
  onSelect,
}) => {
  // Call useCanvas at the top level of the component
  const { canvas, mirror, updateCanvas } = useCanvas()

  // Find source and target objects
  const sourceObj = objects.find((obj) => obj.id === source)
  const targetObj = objects.find((obj) => obj.id === target)

  if (!sourceObj || !targetObj || !sourceObj.interfacePositions || !targetObj.interfacePositions) {
    return null
  }

  // Get interface positions
  const sourceInterfacePos = sourceObj.interfacePositions.get(sourceHandle)
  const targetInterfacePos = targetObj.interfacePositions.get(targetHandle)

  if (!sourceInterfacePos || !targetInterfacePos) {
    return null
  }

  // Calculate absolute positions of interfaces considering rotation around reference point
  const getAbsoluteInterfacePosition = (obj: typeof sourceObj, interfacePos: [number, number]) => {
    const [relX, relY] = interfacePos
    const radians = ((obj.rotation || 0) * Math.PI) / 180
    const refX = obj.width * (obj.referencePosition?.[0] || 0.5)
    const refY = obj.height * (obj.referencePosition?.[1] || 0.5)

    // Calculate position relative to reference point
    const relativeToRef = {
      x: obj.width * relX - refX,
      y: obj.height * relY - refY,
    }

    // Apply rotation around reference point
    const rotatedX = relativeToRef.x * Math.cos(radians) - relativeToRef.y * Math.sin(radians)
    const rotatedY = relativeToRef.x * Math.sin(radians) + relativeToRef.y * Math.cos(radians)

    // Calculate absolute position
    return {
      x: Number(obj.x) + refX + rotatedX,
      y: Number(obj.y) + refY + rotatedY,
    }
  }

  const sourcePos = getAbsoluteInterfacePosition(sourceObj, sourceInterfacePos)
  const targetPos = getAbsoluteInterfacePosition(targetObj, targetInterfacePos)

  // Calculate actual distance (1 pixel = 1 mm)
  const actualDistance = Math.sqrt(Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2))

  // Check if distance constraint is violated (1mm tolerance)
  const isDistanceViolated = Math.abs(actualDistance - distance) > 1

  // Determine if the distance is significantly longer than specified
  const isDistanceTooLong = actualDistance > distance + 10 // 10mm threshold for "too long"

  // Don't render edge if there's no connection (distance is 0 or negative)
  if (distance <= 0) {
    return null
  }

  // Calculate orthogonal path
  const obstacles = objects
    .map((obj) => ({
      id: obj.id,
      x: Number(obj.x),
      y: Number(obj.y),
      width: obj.width,
      height: obj.height,
      rotation: obj.rotation || 0,
    }))
    .filter((obj) => obj.id !== source && obj.id !== target)

  const pathPoints = calculateOrthogonalPath(sourcePos, targetPos, obstacles)
  // Convert the array of points to a flat array of numbers for Konva Line
  const flattenedPath = pathPoints.flatMap((point) => [point.x, point.y])

  // Determine edge color based on conditions
  let edgeColor = "#666666" // Default color
  if (isSelected) {
    edgeColor = "#00ff00" // Selected color
  } else if (isDistanceTooLong) {
    edgeColor = "#ff0000" // Red for significantly longer distances
  } else if (isDistanceViolated) {
    edgeColor = "#ff8800" // Orange for minor violations
  }

  // Calculate midpoint for label positioning
  const midpointIndex = Math.floor(pathPoints.length / 2)
  const midpoint = pathPoints[midpointIndex] || {
    x: (sourcePos.x + targetPos.x) / 2,
    y: (sourcePos.y + targetPos.y) / 2,
  }

  const handleEdgeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true // Prevent event from bubbling up to stage
    onSelect()
  }

  // Function to add a mirror at a corner point
  const addMirrorAtCorner = (point: { x: number; y: number }, index: number) => {
    if (mirror && mirror.length > 0) {
      // Get the first mirror from the mirrors array
      const mirrorTemplate = mirror[0]

      // Calculate rotation angle (45 degrees for perpendicular corners)
      // Determine the rotation based on the adjacent points
      const prevPoint = pathPoints[index] || pathPoints[0]
      const nextPoint = pathPoints[index + 2] || pathPoints[pathPoints.length - 1]

      // Calculate the angle of the incoming and outgoing segments
      const incomingAngle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI)
      const outgoingAngle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI)

      // Calculate the bisector angle (45 degrees from both segments)
      const bisectorAngle = (incomingAngle + outgoingAngle) / 2

      // Create a new mirror object
      const newMirror = {
        id: `mirror-${Date.now()}`,
        name: mirrorTemplate.name,
        x: point.x - mirrorTemplate.width * mirrorTemplate.referencePosition[0],
        y: point.y - mirrorTemplate.height * mirrorTemplate.referencePosition[1],
        width: mirrorTemplate.width,
        height: mirrorTemplate.height,
        fill: "white",
        imageUrl: mirrorTemplate.imageUrl || "/placeholder.svg?height=50&width=50",
        referencePosition: mirrorTemplate.referencePosition,
        rotation: bisectorAngle,
        connectTo: [],
        isStarter: false,
        interfacePositions: mirrorTemplate.interfacePositions,
      }

      // Add the new mirror to the canvas objects
      updateCanvas({
        objects: [...canvas.objects, newMirror],
      })
    }
  }

  return (
    <Group onClick={handleEdgeClick}>
      <Line
        points={flattenedPath}
        stroke={edgeColor}
        strokeWidth={isSelected ? 5 : 2.5} // Increased stroke width for bold line
        lineCap="round"
        lineJoin="round"
      />

      {/* Source interface point */}
      <Circle x={sourcePos.x} y={sourcePos.y} radius={3} fill={edgeColor} />

      {/* Target interface point */}
      <Circle x={targetPos.x} y={targetPos.y} radius={3} fill={edgeColor} />

      {/* Distance label - always show without frame */}
      <Text
        text={`${Math.round(actualDistance)}mm`}
        fontSize={12}
        fontStyle="bold"
        fill={isDistanceTooLong ? "#ff0000" : isDistanceViolated ? "#ff8800" : "#333"}
        align="center"
        verticalAlign="middle"
        x={midpoint.x - 35}
        y={midpoint.y - 6}
        width={70}
      />

      {/* Add clickable points at perpendicular corners */}
      {pathPoints.length > 2 &&
        pathPoints.slice(1, -1).map((point, index) => (
          <Group key={`corner-${index}`}>
            <Circle
              x={point.x}
              y={point.y}
              radius={4}
              fill={edgeColor}
              stroke="#ffffff"
              strokeWidth={1}
              onClick={(e) => {
                e.cancelBubble = true
                onSelect()

                // Add Mirror at perpendicular corner
                addMirrorAtCorner(point, index)
              }}
            />
            {isSelected && index === 0 && (
              <Text text="add Mirror" fontSize={11} fill="#333" x={point.x + 5} y={point.y - 15} />
            )}
          </Group>
        ))}
    </Group>
  )
}

// Then update the Canvas component props to use this interface
interface CanvasProps {
  edges?: EdgeData[]
}

// And update the function signature
function Canvas({ edges: externalEdges }: CanvasProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const { canvas, selectObject, updateObject } = useCanvas()
  const { gridSize, gridColor, gridOpacity, gridStyle, showGrid } = canvas.grid

  const [zoomScale, setZoomScale] = useState<number>(1)
  const [action, setAction] = useState<string>("Move")
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 })
  const [edges, setEdges] = useState<EdgeData[]>([])
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  const [showBoundingBox, setShowBoundingBox] = useState(false)

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

  // Add this useEffect after the other useEffect in the Canvas component
  useEffect(() => {
    if (externalEdges) {
      setEdges(externalEdges)
    }
  }, [externalEdges])

  const RenderGrid = () => {
    if (!showGrid) return null

    const gridLines = []

    if (gridStyle === "dot") {
      for (let i = gridSize * 2; i < canvas.canvasWidth - gridSize; i += gridSize) {
        for (let j = gridSize * 2; j < canvas.canvasHeight - gridSize; j += gridSize) {
          gridLines.push(<Circle key={`d${i}-${j}`} radius={1} x={i} y={j} fill={gridColor} opacity={gridOpacity} />)
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
          />,
        )
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
          />,
        )
      }
    }
    return gridLines
  }

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        selectObject(null)
        setSelectedEdgeId(null)
        setAction("Move")
      }
    },
    [selectObject],
  )

  const handleExport = () => {
    setAction("Export")
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 3 })
      const link = document.createElement("a")
      link.download = "pcb-design.png"
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = stageRef.current
    if (!stage) return

    const oldScale = zoomScale
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const newScale = e.evt.deltaY > 0 ? Math.max(oldScale / 1.1, 0.1) : Math.min(oldScale * 1.1, 5)

    setZoomScale(newScale)
  }

  const handleRotateSelected = () => {
    if (canvas.selectedObjectId) {
      const selectedObject = canvas.objects.find((obj) => obj.id === canvas.selectedObjectId)
      if (selectedObject) {
        const currentRotation = selectedObject.rotation || 0
        const newRotation = (currentRotation + 90) % 360
        updateObject(canvas.selectedObjectId, { rotation: newRotation })
      }
    }
  }

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
            onClick={() => {
              selectObject(null)
              setSelectedEdgeId(null)
              setAction("Move")
            }}
            fill="white"
          />

          {/* Render edges first so they appear behind objects */}
          {edges.map((edge) => (
            <Edge
              key={edge.id}
              id={edge.id}
              source={edge.source}
              sourceHandle={edge.sourceHandle}
              target={edge.target}
              targetHandle={edge.targetHandle}
              distance={edge.distance}
              objects={canvas.objects}
              isSelected={edge.id === selectedEdgeId}
              onSelect={() => {
                setSelectedEdgeId(edge.id)
                selectObject(null)
              }}
            />
          ))}

          {/* Render objects */}
          {canvas.objects.map((obj) => (
            <Object
              key={obj.id}
              id={obj.id}
              x={obj.x}
              y={obj.y}
              width={obj.width}
              height={obj.height}
              imageUrl={obj.imageUrl}
              name={obj.name}
              isSelected={obj.id === canvas.selectedObjectId}
              onSelect={() => {
                selectObject(obj.id)
                setSelectedEdgeId(null)
                setAction("Select")
              }}
              onChange={(newProps) => updateObject(obj.id, newProps)}
              draggable={action === "Select"}
              allObjects={canvas.objects}
              referencePosition={obj.referencePosition || [0.5, 0.5]}
              rotation={obj.rotation || 0}
              gridSize={gridSize}
              showGrid={showGrid}
              gridStyle={gridStyle}
              interfacePositions={obj.interfacePositions}
              showBoundingBox={showBoundingBox}
            />
          ))}

          {RenderGrid()}
        </Layer>
      </Stage>

      {/* Control */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 bg-white p-2 rounded-lg shadow">
        <div className="flex gap-2">
          <button className={`p-2 rounded ${action === "Move" ? "bg-gray-200" : ""}`} onClick={() => setAction("Move")}>
            <FaRegHandPaper size={20} />
          </button>
          <button
            className={`p-2 rounded ${action === "Select" ? "bg-gray-200" : ""}`}
            onClick={() => setAction("Select")}
          >
            <LuMousePointer2 size={20} />
          </button>
          <button className={`p-2 rounded`} onClick={handleRotateSelected} title="Rotate 90° (Selected Object)">
            <MdRotate90DegreesCcw size={20} />
          </button>
          <button
            className={`p-2 rounded ${showBoundingBox ? "bg-gray-200" : ""}`}
            onClick={() => setShowBoundingBox(!showBoundingBox)}
          >
            <RxBox size={20} />
          </button>
          <button className={`p-2 rounded ${action === "Export" ? "bg-gray-200" : ""}`} onClick={handleExport}>
            <AiOutlineExport size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Canvas

