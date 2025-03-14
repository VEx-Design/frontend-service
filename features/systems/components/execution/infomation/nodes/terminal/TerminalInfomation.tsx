import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import React from "react";
import LightProperties from "../../edges/light/LightProperties";
import LightTerminalLister from "./LightTerminalLister";

export default function StarterInfomation() {
  const { focusNode } = useExecution();
  if (!focusNode || focusNode.type !== "terminal") return null;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={10} minSize={5} maxSize={15}>
        <LightTerminalLister />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={15} maxSize={85}>
        <LightProperties />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
