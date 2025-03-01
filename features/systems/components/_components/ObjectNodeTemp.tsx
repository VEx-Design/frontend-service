import React from "react";
import { Type } from "../../libs/ClassType/types/Type";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CustomHandle from "./CustomHandle";

interface Props {
  objectType: Type;
  isSelect?: boolean;
  currentInterfaceId?: string;
}

export default function ObjectNodeTemp({
  objectType,
  isSelect = false,
  currentInterfaceId,
}: Props) {
  const connection = objectType.interfaces || [];
  const [divWidth, setDivWidth] = React.useState<number>(0);

  const connectionLenght = {
    [Position.Top]: 0,
    [Position.Bottom]: 0,
    [Position.Left]: 0,
    [Position.Right]: 0,
  };

  connection.forEach((item) => {
    connectionLenght[item.position] += 1;
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
  const nodeWidth = Math.max(Math.max(82 * lengthHori, 90), divWidth + 32);

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
      className={cn(
        "flex !p-4 flex-1 bg-white justify-center items-center flex-col rounded-lg border-2 border-gray-200",
        isSelect && "border-sky-400"
      )}
      style={{
        height: `${nodeHeight}px`,
        width: `${nodeWidth}px`,
      }}
    >
      <div
        className="flex flex-col justify-center items-center gap-2"
        ref={(el) => {
          if (el) {
            setDivWidth(el.offsetWidth);
          }
        }}
      >
        <div className="relative w-[30px] h-[30px]">
          <Image
            src={objectType.picture || placeholderImage}
            alt={objectType.name || "Placeholder"}
            fill
            quality={100}
            priority
            sizes="(max-width: 768px) 30px, 30px"
            className="object-contain"
          />
        </div>
        <p className="w-full font-semibold text-lg text-center truncate">
          {objectType.displayName}
        </p>
      </div>
      {connection.map((item, index) => {
        connectionCount[item.position] += 1;

        const positionCount = connectionCount[item.position];
        const centerVerti =
          (positionCount * nodeHeight) / (connectionLenght[item.position] + 1);
        const centerHori =
          (positionCount * nodeWidth) / (connectionLenght[item.position] + 1);

        return (
          <div key={`handle-${index}`}>
            <CustomHandle
              item={item}
              isSelect={currentInterfaceId === item.id}
              style={
                item.position === Position.Top
                  ? { left: `${centerHori + 12}px` }
                  : item.position === Position.Bottom
                  ? { left: `${centerHori - 12}px` }
                  : item.position === Position.Left
                  ? { top: `${centerVerti + 12}px` }
                  : { top: `${centerVerti - 12}px` }
              }
            />

            <Handle
              type="source"
              id={`source-handle-${item.id}`}
              position={item.position}
              style={
                item.position === Position.Top
                  ? { left: `${centerHori - 12}px` }
                  : item.position === Position.Bottom
                  ? { left: `${centerHori + 12}px` }
                  : item.position === Position.Left
                  ? { top: `${centerVerti - 12}px` }
                  : { top: `${centerVerti + 12}px` }
              }
              className={cn("!bg-C1 !border-2 !border-background !w-4 !h-4", {
                "!w-5 !h-5": currentInterfaceId === item.id,
              })}
            />
          </div>
        );
      })}
    </div>
  );
}
