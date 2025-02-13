import React from "react";
import { useConfigInterface } from "@/features/systems/contexts/ConfigInterfaceContext";
import FormulaConditionBox from "../_input/formular/FormulaConditionBox";

export default function FormulaLister() {
  const { currentInterface } = useConfigInterface();

  return (
    <div>
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H5 font-bold">{currentInterface?.name}</div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {currentInterface?.formulaConditions.map((condition) => (
          <FormulaConditionBox key={condition.id} condition={condition} />
        ))}
      </div>
    </div>
  );
}
