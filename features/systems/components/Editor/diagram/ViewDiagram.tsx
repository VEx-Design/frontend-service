import React from "react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenuContent } from "@radix-ui/react-context-menu";
import EditorContextMenu from "./EditorContextMenu";
import Diagram from "./Diagram";
import { useEditor } from "@/features/systems/contexts/EditorContext";

export default function ViewDiagram() {
  const { setContextMenuPosition } = useEditor();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="h-full" onContextMenu={handleContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex flex-1 h-full">
            <Diagram />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <EditorContextMenu />
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
