import React from "react";
import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import FormulaInput from "./FormulaInput";
import { useConfigInterface } from "@/features/systems/contexts/ConfigInterfaceContext";
import VariableLister from "./VariableLister";

interface Props {
  conditionId: string;
  param: Parameter;
}

export default function FormularBox({ conditionId, param }: Props) {
  const { currentIdFormula, interfaceAction, formulaAction } =
    useConfigInterface();
  const myFormula = interfaceAction.getFormular({
    conditionId,
    paramId: param.id,
  });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.querySelectorAll("input, textarea").forEach((el) => {
      (el as HTMLElement).blur();
    });
  };

  const handleApply = () => {
    formulaAction.applyFormula({
      conditionId,
      paramId: param.id,
    });
  };

  const handleCancel = () => {
    formulaAction.cancelFormula({
      conditionId,
      paramId: param.id,
    });
  };

  return (
    <div className="flex flex-col justify-between py-3 px-3 border border-editbar-border rounded-xl gap-2">
      <span className="text-sm font-bold">{`${param.name} [${param.symbol}]`}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">{" = "}</span>
        <FormulaInput conditionId={conditionId} paramId={param.id} />
      </div>
      {currentIdFormula?.conditionId === conditionId &&
        currentIdFormula?.paramId === param.id && (
          <div className="bg-white border border-editbar-border rounded-md p-1 text-sm">
            <VariableLister />
          </div>
        )}
      {myFormula?.isEdited && (
        <div className="flex justify-end gap-2">
          <button
            className="text-xs text-white  bg-gray-300 py-1 px-2 rounded-lg"
            onClick={(event) => {
              handleCancel();
              handleClick(event);
            }}
            onMouseDown={onMouseDown}
          >
            Cancel
          </button>
          <button
            className="text-xs text-white bg-C1 py-1 px-2 rounded-lg"
            onClick={(event) => {
              handleApply();
              handleClick(event);
            }}
            onMouseDown={onMouseDown}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
