import { useEffect, useState } from "react";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useNodes } from "@/features/systems/contexts/ProjectWrapper/NodesContext";
import { useEdges } from "@/features/systems/contexts/ProjectWrapper/EdgesContext";
import LeftSidebar from "./sidebar/left-sidebar";
import RightSidebar from "./sidebar/right-sidebar";
import { CanvasProvider } from "../../contexts/CanvasContext";
import Canvas from "./canvas/Canvas";

const TableSimulation = () => {
  return (
    <div className="w-full h-full">
      <CanvasProvider>
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

export default TableSimulation;
