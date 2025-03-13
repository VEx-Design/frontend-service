import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import React, { useMemo } from "react";
import Image from "next/image";

export default function TypeInfo() {
  const { configAction } = useConfig();
  const { focusNode } = useExecution();

  const objectType = useMemo(
    () => configAction.getType(focusNode?.data.object?.typeId || ""),
    [configAction, focusNode?.data.object?.typeId]
  );

  if (!objectType) return null;

  const placeholderImage =
    "https://static-00.iconduck.com/assets.00/placeholder-icon-2048x2048-48kucnce.png";

  return (
    <div className="flex flex-col w-full">
      <div className="text-lg font-bold p-3 border-b">
        {objectType.name || "Unknown"}
      </div>
      <div className="flex items-center justify-center p-3 border-b ">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={objectType.picture || placeholderImage}
            alt={objectType.name || "Placeholder"}
            fill
            quality={100}
            priority
            sizes="(max-width: 768px) 30px, 30px"
            className={`object-contain`}
          />
        </div>
      </div>
    </div>
  );
}
