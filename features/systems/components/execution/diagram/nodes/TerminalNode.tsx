import React, { memo, useMemo } from "react";
import { LogOutIcon } from "lucide-react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";

const TerminalNode = memo((props: NodeProps) => {
  const nodeData = props.data.data as NodeData;
  const { focusNode, setFocusNode } = useExecution();

  const handleOnClick = () => {
    setFocusNode({ id: props.id, type: props.type, data: nodeData });
  };

  const selected = useMemo(
    () => focusNode?.id === props.id,
    [focusNode, props.id]
  );
  return (
    <div
      className={cn(
        "p-6 bg-blue-500 rounded-full justify-center items-center cursor-pointer",
        selected && "bg-blue-600"
      )}
      onClick={handleOnClick}
    >
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
});

export default TerminalNode;
TerminalNode.displayName = "TerminalNode";
