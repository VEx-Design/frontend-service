import { useEffect, useState } from "react"
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext"
import { useNodes } from "@/features/systems/contexts/ProjectWrapper/NodesContext"
import { useEdges } from "@/features/systems/contexts/ProjectWrapper/EdgesContext"
import { CanvasProvider } from "./_components/canvas/CanvasContext"
import LeftSidebar from "./_components/sidebar/left-sidebar"
import RightSidebar from "./_components/sidebar/right-sidebar"
import Canvas , {EdgeData} from "./_components/canvas/Canvas"

interface CanvasObject {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  imageUrl: string
  connectedTo: string[]
  isStartNode: boolean
  referencePosition: [number, number]
  interfacePositions: Map<string, [number, number]>
}

function extractUUID(input: string): string {
  return input.replace(/^(source-handle-|target-handle-)/, '');
}

const FitObject = () => {
  const [canvaObjects, setCanvaObjects] = useState<CanvasObject[]>([])
  const [edges, setEdges] = useState<EdgeData[]>([])
  const { mapBounding } = useConfig()
  const nodesState = useNodes()
  const edgesState = useEdges()

  useEffect(() => {
    const objects = mapBounding.entries()
    const newCanvaObjects: CanvasObject[] = []
    for (const [id, config] of objects) {
      const name = nodesState.nodes.find((node) => node.id === id)?.data.data.object?.name || "Unknown"
      newCanvaObjects.push({
        id: id,
        name: name,
        x: 1,
        y: 1,
        width: config.width,
        height: config.height,
        fill: "black",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s",
        connectedTo: [],
        isStartNode: false,
        referencePosition: config.referencePosition,
        interfacePositions: config.interfacePositions,
      })
    }
    setCanvaObjects(newCanvaObjects)

    const newEdges: EdgeData[] = []
    for (const edge of edgesState.edges) {
      newEdges.push({
        id: edge.id,
        source: edge.source,
        sourceHandle: edge.sourceHandle ? extractUUID(edge.sourceHandle) : "",
        target: edge.target,
        targetHandle: edge.targetHandle ? extractUUID(edge.targetHandle) : "",
        distance: +(edge?.data?.data?.distance ?? 0),
      })
    }
    console.log(newCanvaObjects)
    console.log(newEdges)
    setEdges(newEdges)
  }, [mapBounding, nodesState.nodes, edgesState.edges])

  const [canvasSize, setCanvasSize] = useState<{
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    setCanvasSize({ width: 1000, height: 1000 })
  }, [])

  if (!canvasSize)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )

  return (
    <div className="flex flex-1 w-full h-full">
      <CanvasProvider initialObjects={canvaObjects} initialCanvasSize={canvasSize}>
        <div className="flex flex-1 flex-col h-full w-full">
          <main className="flex flex-1 w-full h-full">
            {/* Left sidebar with fixed width */}
            <div className="h-full shrink-0">
              <LeftSidebar />
            </div>

            {/* Canvas that fills available space */}
            <div className="flex-1 h-full overflow-hidden">
              <Canvas edges={edges} />
            </div>

            {/* Right sidebar with fixed width */}
            <div className="h-full shrink-0">
              <RightSidebar />
            </div>
          </main>
        </div>
      </CanvasProvider>
    </div>
  )
}

export default FitObject

