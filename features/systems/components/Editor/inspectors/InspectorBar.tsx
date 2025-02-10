import { useEditor } from "@/features/systems/contexts/EditorContext";
import React from "react";
import NodeInspector from "./nodes/NodeInspector";
import EdgeInspector from "./edges/EdgeInspector";

export default function InspectorBar() {
  const { focusNode, focusEdge } = useEditor();

  return (
    <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 overflow-y-auto">
      <header className="text-center text-lg font-semibold border-b border-editbar-border pb-4">
        Properties
      </header>
      {focusNode ? (
        <NodeInspector />
      ) : focusEdge ? (
        <EdgeInspector />
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="text-xs text-center text-gray-500">
            Select an object to view its properties.
          </p>
        </div>
      )}
    </div>
  );
}
