import React from "react";
import { LogOutIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

function TerminalNode() {
  return (
    <div className="p-6 bg-blue-500 rounded-full justify-center items-center">
      <Handle
        type="target"
        position={Position.Left}
        id="1"
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !w-4 !h-4",
          "!bg-gray-400"
        )}
      />
      <LogOutIcon size={36} className="stroke-white" />
    </div>
  );
}

export default TerminalNode;
