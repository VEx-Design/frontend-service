import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import Image from "next/image";
import { memo, useContext, useEffect, useMemo } from "react";
import { NodeData, NodeTransferType } from "../../types/object";
import { cn } from "@/lib/utils";
import { EditorContext } from "../Editor";
import { createNewTransfer } from "../../libs/createNewTransfer";
import { AppNode } from "../../types/appNode";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data.data as NodeData;
  const { setNodes } = useReactFlow();
  const nodeHeight = 110; // Height of the node container

  const placeholderImage =
    "https://static-00.iconduck.com/assets.00/placeholder-icon-2048x2048-48kucnce.png";

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
      const newOutput: NodeTransferType[] = Array.from(
        { length: nodeData.type?.output || 0 },
        (_, i) => ({
          handleId: i.toString(),
          param: createNewTransfer(params, nodeData.output?.[i]?.param ?? []),
        })
      );

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
    <>
      <div
        className={cn(
          "flex p-4 bg-white justify-center items-center flex-col gap-2 rounded-lg border-2 border-gray-200",
          selected && "border-sky-400"
        )}
        style={{ height: `${nodeHeight}px` }}
        onClick={handleOnClick}
      >
        <p
          className="absolute text-lg text-black font-bold"
          style={{
            top: `-28px`, // Dynamically offset handles
          }}
        >
          {nodeData.type?.name === "Lens" &&
            `f: ${nodeData.object?.vars[0].value}`}
        </p>
        {[...Array(nodeData.type?.input)].map((id, index) => (
          <Handle
            key={index}
            type="target"
            id={index.toString()}
            position={Position.Left}
            style={{
              top: `${
                ((index + 1) * nodeHeight) / ((nodeData.type?.input ?? 0) + 1)
              }px`, // Dynamically offset handles
            }}
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
          style={{
            objectFit: "contain", // Ensures the image fits within the container
            width: "50px",
            height: "50px",
          }}
        />
        <p>{nodeData.type?.name}</p>
        {[...Array(nodeData.type?.output)].map((_, index) => (
          <Handle
            key={`handle-${index}`}
            type="source"
            id={`source-handle-${index}`}
            position={Position.Right}
            style={{
              top: `${
                ((index + 1) * nodeHeight) / ((nodeData.type?.output ?? 0) + 1)
              }px`, // Dynamically offset handles
            }}
            className={cn(
              "!bg-muted-foreground !border-2 !border-background !w-4 !h-4",
              "!bg-gray-400"
            )}
          />
        ))}
      </div>
    </>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
