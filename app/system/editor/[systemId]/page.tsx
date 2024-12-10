"use client";

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

      <div className="flex h-full">
        {/* Editor Area */}
        <div className="flex-1">
          <Editor />
        </div>

        {/* Inspector Sidebar */}
        <InspectorBar data={data} updateData={updateData} />
      </div>
    </div>
  );
}
