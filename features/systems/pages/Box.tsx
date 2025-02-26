import React, { useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import BoxSizing from "../components/Box/BoxSizing";
import ViewDiagram from "../components/Box/ViewDiagram";
import BoxKonva from "../components/Box/BoxKonva";

export default function Box() {

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={50} minSize={50} maxSize={50}>
        <ViewDiagram />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={50} maxSize={50}>
            <BoxSizing />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={50} maxSize={50} >
            <BoxKonva />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}