import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";
import ViewDiagram from "../components/execution/diagram/ViewDiagram";
import InfomationBar from "../components/execution/infomation/InfomationBar";

export default function Execution() {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={60} minSize={50}>
        <ViewDiagram />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
        <InfomationBar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
