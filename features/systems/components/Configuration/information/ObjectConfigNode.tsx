import { Handle, NodeProps, Position } from "@xyflow/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { useConfig } from "@/features/systems/contexts/ConfigContext";
import { NodeData } from "@/features/systems/libs/ClassNode/types/AppNode";
import { useProject } from "@/features/systems/contexts/ProjectContext";

const NodeComponent = memo((props: NodeProps) => {
  const { configAction } = useProject();
  const { currentInterface } = useConfig();

  const { object } = props.data.data as NodeData;
  const objectType = configAction.getType(object.typeId);
  const connection = objectType.interface || [];

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

  return (
    <div
      className="flex p-4 flex-1 bg-white justify-center items-center flex-col rounded-lg border-2 border-gray-200"
      style={{
        height: `${nodeHeight}px`,
        ...(lengthHori > 0 && { width: `${nodeWidth}px` }),
      }}
    >
      <div className="flex flex-col justify-center items-center gap-2">
        <Image
          src={objectType.picture || placeholderImage}
          alt={objectType.name || "Placeholder"}
          width={30}
          height={30}
          quality={100}
          priority
          className="object-contain"
        />
        <p className="font-semibold text-lg text-center">{objectType.name}</p>
      </div>
      {connection.map((item, index) => {
        connectionCount[item.location] += 1;

        const positionCount = connectionCount[item.location];
        const centerVerti =
          (positionCount * nodeHeight) / (connectionLenght[item.location] + 1);
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
              className={cn(
                "!bg-gray-400 !border-2 !border-background !w-4 !h-4",
                {
                  "!w-5 !h-5": currentInterface?.id === item.id,
                }
              )}
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
              className={cn("!bg-C1 !border-2 !border-background !w-4 !h-4", {
                "!w-5 !h-5": currentInterface?.id === item.id,
              })}
            />
          </div>
        );
      })}
    </div>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
