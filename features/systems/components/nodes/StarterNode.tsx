import React, { memo, useContext, useEffect, useMemo } from "react";
import { LogInIcon } from "lucide-react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { NodeData } from "../../types/object";
import { EditorContext } from "../Editor";
import { createNewTransfer } from "../../libs/createNewTransfer";
import { AppNode } from "../../types/appNode";

const StarterNode = memo((props: NodeProps) => {
  const nodeData = props.data.data as NodeData;
  const { setNodes } = useReactFlow();

  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }
  const { params, focusNode, setFocusNode } = context;

  const handleOnClick = () => {
    setFocusNode({ id: props.id, type: props.type, data: nodeData });
  };

  const selected = useMemo(
    () => focusNode?.id === props.id,
    [focusNode, props.id]
  );

  useEffect(() => {
    if (params) {
      const newOutput = createNewTransfer(params, nodeData.output || []);
      setNodes((nds) =>
        (nds as AppNode[]).map((node) => {
          if (node.id === props.id) {
            if (node.data.data.output !== newOutput) {
              return {
                ...node,
                data: {
                  ...node.data,
                  data: { ...node.data.data, output: newOutput },
                },
              };
            }
          }
          return node;
        })
      );
    }
  }, [params, props.id, setNodes]);

  return (
    <div
      className={cn(
        "p-6 bg-green-500 rounded-full justify-center items-center border-2 border-white",
        selected && "bg-green-600"
      )}
      onClick={handleOnClick}
    >
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
});

export default StarterNode;
StarterNode.displayName = "StarterNode";
