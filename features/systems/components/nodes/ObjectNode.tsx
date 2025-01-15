import { Handle, NodeProps, Position } from "@xyflow/react";
import Image from "next/image";
import { memo, useContext, useMemo } from "react";
import { NodeData } from "../../types/object";
import { cn } from "@/lib/utils";
import { EditorContext } from "../Editor";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data.data as NodeData;

  const placeholderImage =
    "https://static-00.iconduck.com/assets.00/placeholder-icon-2048x2048-48kucnce.png";

  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }
  const { focusNode, setFocusNode } = context;

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
        "flex p-4 bg-white justify-center items-center flex-col gap-2 rounded-lg border-2 border-gray-200",
        selected && "border-sky-400"
      )}
      onClick={handleOnClick}
    >
      {[...Array(nodeData.type?.input)].map((_, id) => (
        <Handle
          key={id}
          type="target"
          id={id.toString()}
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !w-4 !h-4",
            "!bg-gray-400"
          )}
        />
      ))}
      <Image
        src={
          nodeData.type?.picture
            ? nodeData.type?.picture !== ""
              ? nodeData.type?.picture
              : placeholderImage
            : placeholderImage
        }
        alt={nodeData.type?.name || "Placeholder"}
        width={30}
        height={30}
        quality={100}
        priority
      />
      <p>{nodeData.type?.name}</p>
      {[...Array(nodeData.type?.output)].map((_, id) => (
        <Handle
          key={id}
          type="source"
          id={id.toString()}
          position={Position.Right}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !w-4 !h-4",
            "!bg-gray-400"
          )}
        />
      ))}
    </div>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
