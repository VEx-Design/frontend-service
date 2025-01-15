import React from "react";
import { LogInIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

function StarterNode() {
  return (
    <div className="p-6 bg-green-500 rounded-full justify-center items-center">
      <Handle
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !w-4 !h-4",
          "!bg-gray-400"
        )}
      />
      <LogInIcon size={36} className="stroke-white" />
    </div>
  );
}

export default StarterNode;
