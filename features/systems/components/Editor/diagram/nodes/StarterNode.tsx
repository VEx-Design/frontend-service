import React, { memo, useMemo, useCallback } from "react";
import { LogInIcon } from "lucide-react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import PathColor from "../../../_components/PathColor";

const StarterNode = memo((props: NodeProps) => {
  const nodeData = props.data.data as NodeData;
  const { focusNode, setFocusNode } = useEditor();

  // Memoize handleOnClick to prevent unnecessary re-creations
  const handleOnClick = useCallback(() => {
    setFocusNode({ id: props.id, type: props.type, data: nodeData });
  }, [props.id, props.type, nodeData, setFocusNode]);

  // Memoize selected to avoid recalculating on every render
  const selected = useMemo(
    () => focusNode?.id === props.id,
    [focusNode?.id, props.id]
  );

  return (
    <>
      <div
        className={cn(
          "p-6 bg-green-500 rounded-full justify-center items-center border-2 border-white cursor-pointer",
          selected && "bg-green-600"
        )}
        onClick={handleOnClick}
      >
        <Handle
          type="source"
          position={Position.Right}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !w-4 !h-4",
            "!bg-C1"
          )}
          id="1"
        />
        <LogInIcon size={36} className="stroke-white" />
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0%",
          transform: "translate(-50%, -50%) translateX(-15px)",
        }}
        className="flex flex-col justify-center items-center"
      >
        {nodeData.initials?.map((initial, index) => {
          return <PathColor key={index} color={initial.path.color} />;
        })}
      </div>
    </>
  );
});

StarterNode.displayName = "StarterNode";

export default StarterNode;
