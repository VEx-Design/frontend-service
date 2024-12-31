"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@/features/systems/components/Editor";
import EditorNavbar from "@/features/systems/components/EditorNavbar";
import InspectorBar from "@/features/systems/components/InspectorBar";
import { ObjectNode } from "@/features/systems/types/object";
import { useState } from "react";

export default function Page() {
  // Use useState to manage data so it can trigger re-renders
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
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <EditorNavbar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <InspectorBar data={data} updateData={updateData} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} minSize={15}>
          <Editor />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
          <InspectorBar data={data} updateData={updateData} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
