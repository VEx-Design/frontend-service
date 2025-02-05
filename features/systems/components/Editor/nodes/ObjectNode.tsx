import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import Image from "next/image";
import { memo, useContext, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { NodeTransferType } from "@/features/systems/types/object";
import { NodeData } from "@/features/systems/types/object";
import { AppNode } from "@/features/systems/types/appNode";
import { createNewTransfer } from "@/features/systems/libs/createNewTransfer";
import { EditorContext } from "@/features/systems/pages/Editor";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data.data as NodeData;
  const { setNodes } = useReactFlow();
  const connection = nodeData.type?.interface || [];

  const connectionLenght = {
    [Position.Top]: 0,
    [Position.Bottom]: 0,
    [Position.Left]: 0,
    [Position.Right]: 0,
  };

  connection.forEach((item) => {
    connectionLenght[item.location] += 1;
  });

  const lengthHori = Math.max(
    connectionLenght[Position.Top],
    connectionLenght[Position.Bottom]
  );
  const lengthVerti = Math.max(
    connectionLenght[Position.Left],
    connectionLenght[Position.Right]
  );

  const nodeHeight = Math.max(52 * lengthVerti + 90, 180);
  const nodeWidth = Math.max(72 * lengthHori, 110);

  const connectionCount = {
    [Position.Top]: 0,
    [Position.Bottom]: 0,
    [Position.Left]: 0,
    [Position.Right]: 0,
  };

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
        { length: nodeData.type?.interface?.length || 0 },
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
          "flex p-4 flex-1 bg-white justify-center items-center flex-col rounded-lg border-2 border-gray-200",
          selected && "border-sky-400"
        )}
        style={{
          height: `${nodeHeight}px`,
          ...(lengthHori > 0 && { width: `${nodeWidth}px` }),
        }}
        onClick={handleOnClick}
      >
        <div className="flex flex-col justify-center items-center gap-2">
          <Image
            src={nodeData.type?.picture || placeholderImage}
            alt={nodeData.type?.name || "Placeholder"}
            width={30}
            height={30}
            quality={100}
            priority
            className="object-contain"
          />
          <p className="font-semibold text-lg text-center">
            {nodeData.type?.name}
          </p>
        </div>
        {connection.map((item, index) => {
          connectionCount[item.location] += 1;

          const positionCount = connectionCount[item.location];
          const centerVerti =
            (positionCount * nodeHeight) /
            (connectionLenght[item.location] + 1);
          const centerHori =
            (positionCount * nodeWidth) / (connectionLenght[item.location] + 1);

          return (
            <div key={`handle-${index}`}>
              <Handle
                type="target"
                id={`target-handle-${index}`}
                position={item.location}
                style={
                  item.location === Position.Left ||
                  item.location === Position.Right
                    ? { top: `${centerVerti + 12}px` }
                    : { left: `${centerHori + 12}px` }
                }
                className="!bg-gray-400 !border-2 !border-background !w-4 !h-4"
              />
              <Handle
                type="source"
                id={`source-handle-${index}`}
                position={item.location}
                style={
                  item.location === Position.Left ||
                  item.location === Position.Right
                    ? { top: `${centerVerti - 12}px` }
                    : { left: `${centerHori - 12}px` }
                }
                className="!bg-C1 !border-2 !border-background !w-4 !h-4"
              />
            </div>
          );
        })}
      </div>
    </>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
