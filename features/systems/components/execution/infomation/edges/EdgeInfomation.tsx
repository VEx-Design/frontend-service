import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import React from "react";
import LightLister from "./LightLister";
import LightProperties from "./light/LightProperties";

export default function EdgeInfomation() {
  const { focusEdge } = useExecution();
  const lights = focusEdge?.data?.lights;

  if (!lights) return null;
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={10} minSize={5} maxSize={15}>
        <LightLister />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={15} maxSize={85}>
        <LightProperties />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
