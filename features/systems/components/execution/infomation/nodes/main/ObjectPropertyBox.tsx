import SymbolDisplay from "@/components/SymbolDisplay";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { ObjectVariable } from "@/features/systems/libs/ClassObject/types/Object";
import React, { useMemo } from "react";

interface ObjectPropertyBoxProps {
  objVariable: ObjectVariable;
}

export default function ObjectPropertyBox({
  objVariable,
}: ObjectPropertyBoxProps) {
  const { configAction } = useConfig();
  const { focusNode } = useExecution();

  const objectType = useMemo(
    () => configAction.getType(focusNode?.data.object?.typeId || ""),
    [configAction, focusNode?.data.object?.typeId]
  );
  const property = objectType?.properties.find(
    (property) => property.id === objVariable.propId
  );

  if (!property) {
    return null;
  }

  return (
    <div className="flex py-2 px-3 border border-editbar-border rounded-xl gap-2">
      <div className="flex items-center">
        <SymbolDisplay symbol={property.symbol} />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="text-sm font-bold">{" = "}</span>
        <input
          className="w-full border border-editbar-border rounded-md p-1 text-sm"
          type="number"
          value={
            property.unitId === "DEGREE"
              ? objVariable.value * (180 / Math.PI)
              : objVariable.value
          }
          disabled
        />
      </div>
    </div>
  );
}
