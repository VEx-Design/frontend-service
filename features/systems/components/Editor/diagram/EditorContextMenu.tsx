import { ContextMenuItem } from "@/components/ui/context-menu";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import { useReactFlow } from "@xyflow/react";
import React from "react";

export default function EditorContextMenu() {
  const { contextMenuPosition, setContextMenuPosition, nodeAction } =
    useEditor();
  const { screenToFlowPosition } = useReactFlow();

  const handleAddNode = (type: "starter" | "terminal") => {
    if (contextMenuPosition) {
      const position = screenToFlowPosition(contextMenuPosition);
      nodeAction.createNode(type, position);
      setContextMenuPosition(null);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md rounded-md p-2">
      <ContextMenuItem onClick={() => handleAddNode("starter")} inset>
        Add Starter node
      </ContextMenuItem>
      <ContextMenuItem onClick={() => handleAddNode("terminal")} inset>
        Add Terminal node
      </ContextMenuItem>
    </div>
  );
}
