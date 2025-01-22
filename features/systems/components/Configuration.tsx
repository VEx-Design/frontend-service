"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import EnvironmentBar from "./Configuration/EnvironmentBar";

export default function Configuration() {
  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
          <EnvironmentBar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} minSize={15}></ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
