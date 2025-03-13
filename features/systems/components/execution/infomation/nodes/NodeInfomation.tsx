import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import React from "react";
import InputLight from "./input/InputLight";
import OutputLight from "./output/OutputLight";
import ObjectInfomation from "./main/ObjectInfomation";

export default function NodeInfomation() {
  const { focusNode } = useExecution();
  if (!focusNode || focusNode.type !== "ObjectNode") return null;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={40} minSize={40} maxSize={40}>
        <InputLight />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
        <ObjectInfomation />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={40} maxSize={40}>
        <OutputLight />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
