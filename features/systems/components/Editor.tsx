"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import FlowEditor from "@/features/systems/components/Editor/FlowEditor";
import InspectorBar from "@/features/systems/components/Editor/InspectorBar";
import { ObjectNode } from "@/features/systems/types/object";
import { useState } from "react";
import SelectionSide from "./Editor/SelectionSide";
import { ReactFlowProvider } from "@xyflow/react";

export default function Editor() {
  const [data, setData] = useState<ObjectNode>({
    name: "Lens 1",
    type: {
      name: "Lens",
      vars: [
        { name: "focal length", value: 2 },
        { name: "focal length", value: 2 },
      ],
    },
  });

  const updateData = (newData: { name: string }) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <SelectionSide />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={65} minSize={15}>
        <ReactFlowProvider>
          <FlowEditor />
        </ReactFlowProvider>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
        <InspectorBar data={data} updateData={updateData} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
