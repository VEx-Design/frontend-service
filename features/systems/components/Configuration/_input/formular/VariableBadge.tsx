import React from "react";
import { cn } from "@/lib/utils";
import { Property } from "@/features/systems/libs/ClassType/types/Type";
import { Interface } from "@/features/systems/libs/ClassInterface/types/Interface";
import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";

interface Props {
  canClick?: boolean;
  type: "prop" | "interface";
  prop?: Property;
  inter?: Interface;
  param?: Parameter;
}

export default function VariableBadge({
  canClick,
  type,
  prop,
  inter,
  param,
}: Props) {
  const { formulaAction } = useConfigInterface();
  return (
    <div
      className={cn(
        "inline-flex bg-gray-200 px-1.5 rounded-md whitespace-nowrap gap-x-1 items-end",
        { "cursor-pointer": canClick }
      )}
      onMouseDown={(e) => {
        if (canClick) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onClick={() => {
        if (canClick) {
          formulaAction.addVariable({
            id: crypto.randomUUID(),
            type,
            propId: prop?.id,
            interfaceId: inter?.id,
            paramId: param?.id,
          });
        }
      }}
    >
      <span className="inline-block align-baseline text-sm font-semibold">
        {type === "prop" ? prop?.symbol : param?.symbol}
      </span>
      {type === "interface" && (
        <span className="inline-block align-text-bottom text-[10px] text-gray-600">
          {inter?.name}
        </span>
      )}
    </div>
  );
}
