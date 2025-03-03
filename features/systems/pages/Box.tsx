import React, { useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import BoxSizing from "../components/Box/BoxSizing";
import ViewDiagram from "../components/Box/ViewDiagram";
import BoxKonva from "../components/Box/BoxKonva";

export default function Box() {
  return (
    <div className="h-full w-full bg-background">
      <ResizablePanelGroup direction="vertical" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60} className="p-0">
          <div className="h-full overflow-hidden">
            <ViewDiagram />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={40}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40} minSize={30} maxSize={60} className="p-4">
              <BoxSizing />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={40} className="p-0">
              <BoxKonva />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}