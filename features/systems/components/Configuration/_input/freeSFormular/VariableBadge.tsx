import React from "react";
import { cn } from "@/lib/utils";
import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import { useConfigFreeS } from "@/features/systems/contexts/ConfigFreeSContext";

interface Props {
  canClick?: boolean;
  type: "distance" | "parameter";
  param?: Parameter;
}

export default function VariableBadge({ canClick, type, param }: Props) {
  const { formulaAction } = useConfigFreeS();
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
            paramId: param?.id,
          });
        }
      }}
    >
      <span className="inline-block align-baseline text-sm font-semibold">
        {type === "distance" ? "l" : param?.symbol}
      </span>
    </div>
  );
}
