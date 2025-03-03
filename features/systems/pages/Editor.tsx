"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TypeLister from "../components/Editor/TypeLister";
import ViewDiagram from "../components/Editor/diagram/ViewDiagram";
import InspectorBar from "../components/Editor/inspectors/InspectorBar";
import { useCallback, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useReactFlow } from "@xyflow/react";

export default function Editor() {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const lastFitViewCall = useRef<number>(0);
  const { fitView } = useReactFlow();

  const handleResize = useCallback(() => {
    const now = Date.now();
    if (now - lastFitViewCall.current > 200) {
      // Limit updates to avoid excessive calls
      fitView({ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 });
      lastFitViewCall.current = now;
    }
  }, [fitView]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full"
      onLayout={handleResize} // Use onLayout instead of onResize for better resizing
    >
      <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
        <TypeLister />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        ref={panelRef}
        defaultSize={70}
        minSize={15}
        maxSize={85}
        className="h-full"
      >
        <ViewDiagram />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
        <InspectorBar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
