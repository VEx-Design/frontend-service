import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";
import FocusDistanceSelector from "./FocusDistanceSelector";
import LightVisualize from "./LightVisualize";

export default function LightProperties() {
  return (
    <>
      <div className="bg-C1 border-b">
        <div className="flex flex-1 px-4 py-4 bg-white gap-2">
          <FocusDistanceSelector />
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={40} minSize={40} maxSize={40}>
          <LightVisualize />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} minSize={15} maxSize={85}>
          <div className="flex flex-1">ddd</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
