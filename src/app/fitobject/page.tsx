//import { v4 as uuidv4 } from "uuid";
import Canvas from "./_components/canvas/Canvas";
import LeftSidebar from "./_components/sidebar/left-sidebar";
import RightSidebar from "./_components/sidebar/right-sidebar";
import { CanvasProvider } from "./_components/canvas/CanvasContext";
import { useEffect, useState } from "react";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useNodes } from "@/features/systems/contexts/ProjectWrapper/NodesContext";

interface CanvasObject {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    imageUrl: string;
    connectedTo: string[];
    isStartNode: boolean;
    referencePosition: [number,number]
}

const FitObject = () => {

  const [canvaObjects, setCanvaObjects] = useState<CanvasObject[]>([]);
  const { mapBounding } = useConfig();
  const nodesState = useNodes();

  useEffect(() => {
    const objects = mapBounding.entries();
    const newCanvaObjects: CanvasObject[] = [];
    for (const [id, config] of objects) {
      const name = nodesState.nodes.find((node) => node.id === id)?.data.data.object?.name || "Unknown";
      newCanvaObjects.push({
        id: id,
        name: name,
        x: 1,
        y: 1,
        width: config.width,
        height: config.height,
        fill: "black",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s",
        connectedTo: [],
        isStartNode: false,
        referencePosition: config.referencePosition,
      });
    }
    setCanvaObjects(newCanvaObjects);
  }, [mapBounding]);

  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    setCanvasSize({ width: 1000, height: 1000 });
  }, []);

  if (!canvasSize)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );

  return (
    <div className="flex flex-1 w-full h-full">
      <CanvasProvider
        initialObjects={canvaObjects}
        initialCanvasSize={canvasSize}
      >
        <div className="flex flex-1 flex-col h-full w-full">
          <main className="flex flex-1 w-full h-full">
            {/* Left sidebar with fixed width */}
            <div className="h-full shrink-0">
              <LeftSidebar />
            </div>

            {/* Canvas that fills available space */}
            <div className="flex-1 h-full overflow-hidden">
              <Canvas />
            </div>

            {/* Right sidebar with fixed width */}
            <div className="h-full shrink-0">
              <RightSidebar />
            </div>
          </main>
        </div>
      </CanvasProvider>
    </div>
  );
};

export default FitObject;
