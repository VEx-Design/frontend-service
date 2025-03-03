import type Konva from "konva"
import React, { useState, useEffect, useRef } from "react"
import { Stage, Layer, Rect, Text, Circle } from "react-konva"
import { useResizeDetector } from "react-resize-detector"
import { useBox } from "../../contexts/BoxContext"
import { useProject } from "../../contexts/ProjectContext"
import type { BoundingConfiguration } from "../../libs/ClassBox/types/BoundingConfiguration"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ZoomIn, ZoomOut, Eye, EyeOff, Maximize } from "lucide-react"

export default function BoxKonva() {
  const { ref, width = 400, height = 400 } = useResizeDetector()
  const { focusNode, focusPoint, config, nodesState } = useBox()
  const { mapBounding, setMapBounding } = useProject() as {
    mapBounding: Map<string, BoundingConfiguration>
    setMapBounding: React.Dispatch<React.SetStateAction<Map<string, BoundingConfiguration>>>
    blueprint: Map<string, BoundingConfiguration[]>
    setBlueprint: React.Dispatch<React.SetStateAction<Map<string, BoundingConfiguration[]>>>
  }

  // Scaling factor: 1mm = 10px
  const scalingFactor = 10

  const [squareSize, setSquareSize] = useState({ width: 0, height: 0 })
  const [relativePos, setRelativePos] = useState<{ x: number; y: number | null }>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [showPoints, setShowPoints] = useState(true)
  const stageRef = useRef<Konva.Stage>(null)

  useEffect(() => {
    if (focusNode) {
      const nodeInfo = mapBounding.get(focusNode.id)
      if (nodeInfo) {
        // Ensure width and height are valid numbers
        const nodeWidth = typeof nodeInfo.width === "number" && !isNaN(nodeInfo.width) ? nodeInfo.width : 0
        const nodeHeight = typeof nodeInfo.height === "number" && !isNaN(nodeInfo.height) ? nodeInfo.height : 0

        // Apply scaling factor to convert mm to pixels
        const scaledWidth = nodeWidth * scalingFactor
        const scaledHeight = nodeHeight * scalingFactor

        const newSquareSize = { width: scaledWidth, height: scaledHeight }
        setSquareSize(newSquareSize)

        // Auto-fit the box in the viewport
        if (width > 0 && height > 0 && scaledWidth > 0 && scaledHeight > 0) {
          const padding = 0.1
          const maxWidthZoom = (width * (1 - padding)) / scaledWidth
          const maxHeightZoom = (height * (1 - padding)) / scaledHeight
          const newZoom = Math.min(maxWidthZoom, maxHeightZoom, 1)

          setZoom(newZoom)
          setOffset({
            x: width / 2 - (scaledWidth * newZoom) / 2,
            y: height / 2 - (scaledHeight * newZoom) / 2,
          })
        }
      } else {
        setSquareSize({ width: 0, height: 0 })
      }
    } else {
      setSquareSize({ width: 0, height: 0 })
    }
  }, [focusNode, mapBounding, width, height])

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()
    if (!pointer) return

    const unscaledX = (pointer.x - offset.x) / zoom
    const unscaledY = (pointer.y - offset.y) / zoom

    if (unscaledX >= 0 && unscaledX <= squareSize.width && unscaledY >= 0 && unscaledY <= squareSize.height) {
      setRelativePos({
        x: Math.round(unscaledX / scalingFactor),
        y: Math.round(unscaledY / scalingFactor),
      })
    } else {
      setRelativePos({ x: 0, y: null })
    }
  }

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only start dragging if not clicking on a point (circle)
    if (e.target.getClassName() !== "Circle") {
      setIsDragging(true)
      setLastMouse({ x: e.evt.clientX, y: e.evt.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMoveDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isDragging) {
      const dx = e.evt.clientX - lastMouse.x
      const dy = e.evt.clientY - lastMouse.y
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setLastMouse({ x: e.evt.clientX, y: e.evt.clientY })
    }
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const stage = stageRef.current
    const scaleBy = 1.05
    const oldScale = zoom
    const pointer = stage?.getPointerPosition()
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy

    if (!pointer) return
    const mouseXBeforeZoom = (pointer.x - offset.x) / oldScale
    const mouseYBeforeZoom = (pointer.y - offset.y) / oldScale

    setZoom(Math.max(0.3, Math.min(2, newScale)))
    setOffset({
      x: pointer.x - mouseXBeforeZoom * newScale,
      y: pointer.y - mouseYBeforeZoom * newScale,
    })
  }

  const handlePointClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Prevent the stage from starting drag
    e.cancelBubble = true

    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()
    if (!pointer || !focusNode || squareSize.width === 0 || squareSize.height === 0) return

    const unscaledX = (pointer.x - offset.x) / zoom
    const unscaledY = (pointer.y - offset.y) / zoom

    // Ensure we're within bounds
    if (unscaledX < 0 || unscaledX > squareSize.width || unscaledY < 0 || unscaledY > squareSize.height) return

    // Convert to normalized coordinates (0-1)
    const x = unscaledX / squareSize.width
    const y = unscaledY / squareSize.height

    if (focusPoint !== "") {
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
    }
  }

  const handleCircleClick = (e: Konva.KonvaEventObject<MouseEvent>, position: [number, number]) => {
    // Prevent the stage from starting drag
    e.cancelBubble = true

    if (focusPoint !== "") {
      if (focusPoint === "Reference Point") {
        setMapBounding((prev) => {
          const newMapBounding = new Map(prev)
          newMapBounding.set(focusNode!.id, {
            ...newMapBounding.get(focusNode!.id)!,
            referencePosition: position,
          })
          return newMapBounding
        })
      } else {
        setMapBounding((prev) => {
          const newMapBounding = new Map(prev)
          const nodeInfo = newMapBounding.get(focusNode!.id)
          if (nodeInfo) {
            const newInterfacePositions = new Map(nodeInfo.interfacePositions)
            newInterfacePositions.set(focusPoint, position)
            newMapBounding.set(focusNode!.id, {
              ...nodeInfo,
              interfacePositions: newInterfacePositions,
            })
          }
          return newMapBounding
        })
      }
    }
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 2)
    setZoom(newZoom)
    // Adjust offset to keep center point
    setOffset({
      x: width / 2 - (squareSize.width * newZoom) / 2,
      y: height / 2 - (squareSize.height * newZoom) / 2,
    })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3)
    setZoom(newZoom)
    // Adjust offset to keep center point
    setOffset({
      x: width / 2 - (squareSize.width * newZoom) / 2,
      y: height / 2 - (squareSize.height * newZoom) / 2,
    })
  }

  const handleReset = () => {
    if (width > 0 && height > 0 && squareSize.width > 0 && squareSize.height > 0) {
      const padding = 0.1
      const maxWidthZoom = (width * (1 - padding)) / squareSize.width
      const maxHeightZoom = (height * (1 - padding)) / squareSize.height
      const newZoom = Math.min(maxWidthZoom, maxHeightZoom, 1)

      setZoom(newZoom)
      setOffset({
        x: width / 2 - (squareSize.width * newZoom) / 2,
        y: height / 2 - (squareSize.height * newZoom) / 2,
      })
    }
  }

  return (
    <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-background">
      <div className="p-2 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleReset}>
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
                  {showPoints ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showPoints ? "Hide Points" : "Show Points"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="text-xs text-muted-foreground">
          {focusPoint && <span className="font-medium text-primary">Placing: {focusPoint}</span>}
        </div>
      </div>

      <div
        ref={ref}
        className="relative flex-grow"
        style={{
          cursor: isDragging ? "grabbing" : focusPoint ? "crosshair" : "grab",
        }}
      >
        {squareSize.width === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Select a node to view and edit its bounding configuration
          </div>
        )}

        <div className="absolute bottom-2 left-2 text-xs bg-background/90 px-2 py-1 rounded-md border shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="font-medium">Zoom: {(zoom * 100).toFixed(0)}%</span>
            {relativePos.y !== null && (
              <span>
                Position: ({relativePos.x}, {relativePos.y}) mm
              </span>
            )}
          </div>
          {squareSize.width > 0 && (
            <div>
              Size: {(squareSize.width / scalingFactor).toFixed(1)}mm × {(squareSize.height / scalingFactor).toFixed(1)}
              mm
            </div>
          )}
        </div>

        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMoveCapture={handleMouseMoveDrag}
          onWheel={handleWheel}
          onClick={handlePointClick}
          className="bg-[#f8f9fa]"
        >
          <Layer>
            {/* Background grid */}
            <Rect x={0} y={0} width={width} height={height} fill="transparent" onMouseDown={handleMouseDown} />

            {squareSize.width > 0 && (
              <Rect
                x={offset.x}
                y={offset.y}
                width={squareSize.width * zoom}
                height={squareSize.height * zoom}
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

            {relativePos.y !== null && (
              <Text
                text={`(${relativePos.x}, ${relativePos.y})`}
                x={offset.x + relativePos.x * scalingFactor * zoom + 10}
                y={offset.y + relativePos.y * scalingFactor * zoom - 30}
                fontSize={14}
                fill="#333"
                fontStyle="bold"
                padding={4}
                background="#fff"
                cornerRadius={3}
              />
            )}

            {showPoints &&
              focusNode &&
              (() => {
                const combinedPoints = new Map<string, { x: number; y: number; labels: string[] }>()

                // Add reference point
                const referencePosition = mapBounding.get(focusNode.id)?.referencePosition
                if (referencePosition) {
                  const [refX, refY] = referencePosition
                  const key = `${refX},${refY}`
                  combinedPoints.set(key, {
                    x: refX,
                    y: refY,
                    labels: ["Reference Point"],
                  })
                }

                // Add interface points
                const interfacePositions = mapBounding.get(focusNode.id)?.interfacePositions
                if (interfacePositions) {
                  interfacePositions.forEach((pos, key) => {
                    const nodeId = focusNode.id
                    const node = nodesState.nodes.find((node) => node.id === nodeId)
                    let name = ""

                    if (node?.type === "ObjectNode") {
                      const typeID = node?.data.data.object?.typeId
                      const interfaces = config.types.find((type) => type.id === typeID)?.interfaces
                      if (interfaces) {
                        name = interfaces.find((intf) => intf.id === key)?.name || ""
                      } else {
                        name = ""
                      }
                    } else if (node?.type === "starter") {
                      name = "Output"
                    } else {
                      name = "Input"
                    }

                    const [intX, intY] = pos
                    const pointKey = `${intX},${intY}`
                    if (combinedPoints.has(pointKey)) {
                      combinedPoints.get(pointKey)!.labels.push(name)
                    } else {
                      combinedPoints.set(pointKey, {
                        x: intX,
                        y: intY,
                        labels: [name],
                      })
                    }
                  })
                }

                // Render combined points
                return Array.from(combinedPoints.values()).map(({ x, y, labels }, index) => {
                  const isReferencePoint = labels.includes("Reference Point")
                  return (
                    <React.Fragment key={`${x},${y}`}>
                      <Circle
                        x={offset.x + x * squareSize.width * zoom}
                        y={offset.y + y * squareSize.height * zoom}
                        radius={6}
                        fill={isReferencePoint ? "#ef4444" : "#10b981"}
                        stroke="#fff"
                        strokeWidth={2}
                        shadowColor="rgba(0,0,0,0.3)"
                        shadowBlur={3}
                        shadowOffset={{ x: 1, y: 1 }}
                        shadowOpacity={0.5}
                        onClick={(e) => handleCircleClick(e, [x, y])}
                      />
                      <Text
                        text={`(${Math.round((x * squareSize.width) / scalingFactor)}, ${Math.round((y * squareSize.height) / scalingFactor)}) mm\n${labels.join(", ")}`}
                        x={offset.x + x * squareSize.width * zoom + 10}
                        y={offset.y + y * squareSize.height * zoom - 20}
                        fontSize={14}
                        fontStyle={isReferencePoint ? "bold" : "normal"}
                        fill={isReferencePoint ? "#ef4444" : "#10b981"}
                        padding={4}
                        background="rgba(255,255,255,0.8)"
                        cornerRadius={3}
                        shadowColor="rgba(0,0,0,0.1)"
                        shadowBlur={2}
                        shadowOffset={{ x: 1, y: 1 }}
                      />
                    </React.Fragment>
                  )
                })
              })()}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

