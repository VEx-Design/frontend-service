import React, { useState } from "react";
import FormularBox from "./FormularBox";
import { FormulaCondition } from "@/features/systems/libs/ClassInterface/types/Formula";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";

interface Props {
  condition: FormulaCondition;
}

export default function FormulaConditionBox({ condition }: Props) {
  const { config } = useConfig();
  const { typeAction } = useConfigType();
  const [isOpen, setIsOpen] = useState(false);

  let conditionName;
  if (condition.type === "DEFAULT") {
    conditionName = "Default";
  } else if (condition.type === "TRIGGER AT") {
    const interfaceId = condition.interfaceId;
    const interfaceName = interfaceId
      ? typeAction.getInterface(interfaceId)?.name
      : undefined;
    conditionName = `Trigger at ${interfaceName}`;
  }

  return (
    <div className="flex flex-1 flex-col justify-between py-3 px-3 border border-editbar-border rounded-xl gap-2">
      <div
        className="flex w-full items-center justify-between cursor-pointer"
        onClick={(e) => {
          setIsOpen((value) => !value);
          e.stopPropagation();
        }}
      >
        <p className={cn("text-base font-bold", "text-gray-700")}>
          {conditionName}
        </p>
        <button className="p-2">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {isOpen && (
        <div className="flex w-full flex-col gap-2">
          {config.parameters.map((param) => (
            <FormularBox
              key={condition.id + param.id}
              param={param}
              conditionId={condition.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
