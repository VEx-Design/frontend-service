"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TypeLister from "../components/editor/TypeLister";
import ViewDiagram from "../components/editor/diagram/ViewDiagram";
import InspectorBar from "../components/editor/inspectors/InspectorBar";

export default function Editor() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
        <TypeLister />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={15}>
        <ViewDiagram />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
        <InspectorBar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
