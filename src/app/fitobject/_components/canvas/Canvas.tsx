import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Stage, Layer, Line, Circle, Image as KonvaImage, Group, Rect, Text } from "react-konva"
import { useCanvas } from "./CanvasContext"
import useImage from "use-image"
import type Konva from "konva"
import { FaRegHandPaper } from "react-icons/fa"
import { AiOutlineExport } from "react-icons/ai"
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
    x: number
    y: number
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
}

const Object: React.FC<KonvaObjectProps> = ({
  id,
  x,
  y,
  width,
  height,
  imageUrl,
  name,
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
          currentX < obj.x + obj.width &&
          currentX + width > obj.x &&
          currentY < obj.y + obj.height &&
          currentY + height > obj.y

        return isOverlapping
      })
    },
    [id, width, height, allObjects],
  )

  useEffect(() => {
    setIsColliding(checkCollision(x, y))
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
          fill="#666666"
          stroke="#333333"
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
          stroke={isSelected ? "#00ff00" : "#ddd"}
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

        {/* Component name */}
        <Text text={name} x={0} y={height + 5} width={width} align="center" fontSize={12} fill="#333" />

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
    x: number
    y: number
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
  id,
  source,
  sourceHandle,
  target,
  targetHandle,
  distance,
  objects,
  isSelected,
  onSelect,
}) => {
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
      x: obj.x + refX + rotatedX,
      y: obj.y + refY + rotatedY,
    }
  }

  const sourcePos = getAbsoluteInterfacePosition(sourceObj, sourceInterfacePos)
  const targetPos = getAbsoluteInterfacePosition(targetObj, targetInterfacePos)

  // Calculate actual distance (1 pixel = 1 mm)
  const actualDistance = Math.sqrt(Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2))

  // Check if distance constraint is violated (1mm tolerance)
  const isDistanceViolated = Math.abs(actualDistance - distance) > 1

  // Don't render edge if there's no connection (distance is 0 or negative)
  if (distance <= 0) {
    return null
  }

  // Calculate orthogonal path
  const obstacles = objects
    .map((obj) => ({
      id: obj.id,
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      rotation: obj.rotation || 0,
    }))
    .filter((obj) => obj.id !== source && obj.id !== target)

  const pathPoints = calculateOrthogonalPath(sourcePos, targetPos, obstacles)
  // Convert the array of points to a flat array of numbers for Konva Line
  const flattenedPath = pathPoints.flatMap((point) => [point.x, point.y])

  return (
    <Group onClick={onSelect}>
      <Line
        points={flattenedPath}
        stroke={isDistanceViolated ? "#ff0000" : isSelected ? "#00ff00" : "#666666"}
        strokeWidth={isSelected ? 2 : 1.5}
        lineCap="round"
        lineJoin="round"
      />

      {/* Source interface point */}
      <Circle x={sourcePos.x} y={sourcePos.y} radius={3} fill={isDistanceViolated ? "#ff0000" : "#666666"} />

      {/* Target interface point */}
      <Circle x={targetPos.x} y={targetPos.y} radius={3} fill={isDistanceViolated ? "#ff0000" : "#666666"} />

      {/* Distance label */}
      {isSelected && (
        <Group x={(sourcePos.x + targetPos.x) / 2} y={(sourcePos.y + targetPos.y) / 2}>
          <Rect x={-30} y={-10} width={60} height={20} fill="white" opacity={0.8} cornerRadius={3} />
          <Text
            text={`${Math.round(actualDistance)}mm${isDistanceViolated ? " ⚠️" : ""}`}
            fontSize={12}
            fill={isDistanceViolated ? "#ff0000" : "#333"}
            align="center"
            verticalAlign="middle"
            width={60}
            height={20}
            x={-30}
            y={-10}
          />
        </Group>
      )}
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

 

  // Add mock interface positions to objects
  useEffect(() => {
    canvas.objects.forEach((obj) => {
      if (!obj.interfacePositions) {
        const interfaces = new Map<string, [number, number]>()

        // Standard interfaces (8 positions)
        interfaces.set("in1", [0, 0.5]) // Left middle
        interfaces.set("out1", [1, 0.5]) // Right middle
        interfaces.set("top1", [0.5, 0]) // Top middle
        interfaces.set("bottom1", [0.5, 1]) // Bottom middle

        // Corner interfaces
        interfaces.set("starter", [0.25, 0.25]) // Top left
        interfaces.set("terminal", [0.75, 0.75]) // Bottom right
        interfaces.set("1", [0.25, 0.75]) // Bottom left
        interfaces.set("2", [0.75, 0.25]) // Top right

        // Additional numbered interfaces
        interfaces.set("3", [0.5, 0.25]) // Top center
        interfaces.set("4", [0.75, 0.5]) // Right center
        interfaces.set("5", [0.5, 0.75]) // Bottom center
        interfaces.set("6", [0.25, 0.5]) // Left center

        updateObject(obj.id, { interfacePositions: interfaces })
      }
    })
  }, [canvas.objects, updateObject])

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
            />
          ))}

          {RenderGrid()}
        </Layer>
      </Stage>

      {/* Control */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-2 rounded-lg shadow">
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
        <button className={`p-2 rounded ${action === "Export" ? "bg-gray-200" : ""}`} onClick={handleExport}>
          <AiOutlineExport size={20} />
        </button>
      </div>
    </div>
  )
}

export default Canvas