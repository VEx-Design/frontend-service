import React from "react";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import FormularBox from "./FormularBox";
import { FormulaCondition } from "@/features/systems/libs/ClassInterface/types/Formula";

interface Props {
  condition: FormulaCondition;
}

export default function FormulaConditionBox({ condition }: Props) {
  const { config } = useProject();

  return (
    <div className="flex flex-col justify-between py-3 px-3 border border-editbar-border rounded-xl gap-2">
      <p className="text-base font-bold text-gray-400">default</p>
      <div className="flex flex-col gap-2">
        {config.parameters.map((param) => (
          <FormularBox
            key={param.id}
            param={param}
            conditionId={condition.id}
          />
        ))}
      </div>
    </div>
  );
}
