import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useCallback, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { ImperativePanelHandle } from "react-resizable-panels";
import ViewDiagram from "../components/Execution/diagram/ViewDiagram";
import InfomationBar from "../components/Execution/infomation/InfomationBar";
import { useProject } from "../contexts/ProjectContext";
import { StepForward } from "lucide-react";

export default function Execution() {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const { fitView } = useReactFlow();

  const handleResize = useCallback(() => {
    if (panelRef.current) {
      fitView({ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 });
    }
  }, [fitView]);
  const { executedFlow, executeProject } = useProject();

  if (!executedFlow) {
    return (
      <div className="flex items-center justify-center h-full w-full flex-col gap-3">
        <span className="text-xl font-bold text-gray-400">
          You have not executed any flow yet
        </span>
        <button
          onClick={executeProject}
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
        >
          <StepForward size={18} className="mr-2" strokeWidth={2} />
          Execute
        </button>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="vertical" className="h-full w-full">
      <ResizablePanel
        ref={panelRef}
        onResize={handleResize}
        defaultSize={60}
        minSize={40}
        maxSize={60}
        className="h-full"
      >
        <ViewDiagram />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={20} maxSize={40}>
        <InfomationBar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
