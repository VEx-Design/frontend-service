import React, { useCallback, useEffect, useRef } from "react";
import AutoWidthInput from "./AutoWidthInput";
import VariableBox from "./VariableBadge";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";
import { useConfig } from "@/features/systems/contexts/Configuration/ConfigContext";

interface Props {
  conditionId: string;
  paramId: string;
}

export default function FormulaInput({ conditionId, paramId }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    currentIdFormula,
    indexTofocus,
    setIndexTofocus,
    setCurrentIdFormula,
    setCurrentInputPosition,
    interfaceAction,
    formulaAction,
  } = useConfigInterface();
  const myFormula = interfaceAction.getFormular({ conditionId, paramId });
  const varLength = myFormula?.formula.formulaTokens.length ?? 0;

  const { typeAction } = useConfig();
  const { configAction } = useProject();

  const updateCursorPosition =
    (index: number) => (e: React.SyntheticEvent<HTMLInputElement>) => {
      const cursorPos = e.currentTarget.selectionStart ?? 0;
      setCurrentInputPosition({ index, position: cursorPos });
    };

  const moveCursorToPosition = useCallback(
    (index: number, position: number) => {
      const input = inputRefs.current[index];

      if (input) {
        input.focus();
        input.setSelectionRange(position, position);
      }
    },
    [inputRefs]
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const input = inputRefs.current[index];

    if (!input || input.selectionStart === null) return;

    const isAtStart = input.selectionStart === 0;
    const isAtEnd = input.selectionStart === input.value.length;

    if (e.key === "ArrowLeft" && isAtStart && index > 0) {
      e.preventDefault();
      moveCursorToPosition(
        index - 1,
        inputRefs.current[index - 1]?.value.length || 0
      );
    } else if (
      e.key === "ArrowRight" &&
      isAtEnd &&
      index < inputRefs.current.length - 1
    ) {
      e.preventDefault();
      moveCursorToPosition(index + 1, 0);
    } else if (e.key === "Backspace" && isAtStart && index > 0) {
      e.preventDefault();
      formulaAction.deleteVariable();
    }
  };

  useEffect(() => {
    if (
      currentIdFormula?.conditionId === conditionId &&
      currentIdFormula?.paramId === paramId &&
      indexTofocus !== undefined
    ) {
      moveCursorToPosition(indexTofocus ?? 0, 0);
      setIndexTofocus(undefined);
    }
  }, [
    currentIdFormula,
    conditionId,
    paramId,
    indexTofocus,
    moveCursorToPosition,
    setIndexTofocus,
  ]);

  return (
    <div className="flex border border-editbar-border rounded-md p-1 bg-white text-sm w-full">
      {myFormula?.formula.formulaTokens.map(({ stream, variable }, index) => (
        <React.Fragment key={index}>
          <AutoWidthInput
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={stream ?? ""}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setCurrentIdFormula({ conditionId, paramId })}
            onSelect={(e) => {
              updateCursorPosition(index)(e);
            }}
            onChange={(e) => formulaAction.setStream(e.target.value)}
            onBlur={() => setCurrentIdFormula(undefined)}
          />
          <VariableBox
            type={variable.type}
            prop={typeAction.getProperty(variable.propId ?? "")}
            inter={typeAction.getInterface(variable.interfaceId ?? "")}
            param={configAction.getParameter(variable.paramId ?? "")}
          />
        </React.Fragment>
      ))}
      <input
        ref={(el) => {
          inputRefs.current[varLength] = el;
        }}
        type="text"
        className="w-full outline-none focus:ring-0 focus:border-transparent"
        value={myFormula?.formula.lastStream ?? ""}
        onKeyDown={(e) => handleKeyDown(e, varLength)}
        onFocus={() => {
          setCurrentIdFormula({ conditionId, paramId });
        }}
        onSelect={(e) => {
          updateCursorPosition(varLength)(e);
        }}
        onChange={(e) => formulaAction.setStream(e.target.value)}
        onBlur={() => setCurrentIdFormula(undefined)}
      />
    </div>
  );
}
