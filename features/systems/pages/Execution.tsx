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

export default function Execution() {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const { fitView } = useReactFlow();

  const handleResize = useCallback(() => {
    if (panelRef.current) {
      fitView({ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 });
    }
  }, [fitView]);

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
