import { FormulaId, FormulaStatus, Variable } from "../types/Formula";
import getFormular from "./getFormula";

export default function addVariable(
  formulars: FormulaStatus[],
  currentIdFormula: FormulaId,
  focusIndex: number,
  focusPosition: number,
  newVariable: Variable
): FormulaStatus[] {
  const target = getFormular(formulars, currentIdFormula);
  if (currentIdFormula) {
    if (target) {
      if (focusIndex < target.formula.formulaTokens.length) {
        const streamLeft = target.formula.formulaTokens[
          focusIndex
        ].stream.slice(0, focusPosition);
        const streamRight =
          target.formula.formulaTokens[focusIndex].stream.slice(focusPosition);
        const newFormulars = formulars.map((f) => {
          if (
            f.conditionId === currentIdFormula.conditionId &&
            f.formula.paramId === currentIdFormula.paramId
          ) {
            return {
              ...f,
              formula: {
                ...f.formula,
                formulaTokens: [
                  ...f.formula.formulaTokens.slice(0, focusIndex),
                  {
                    id: crypto.randomUUID(),
                    stream: streamLeft,
                    variable: newVariable,
                  },
                  ...f.formula.formulaTokens
                    .slice(focusIndex)
                    .map((token, index) => {
                      if (index === 0) {
                        return {
                          ...token,
                          stream: streamRight,
                        };
                      }
                      return token;
                    }),
                ],
              },
              isEdited: true,
            };
          }
          return f;
        });
        return newFormulars;
      } else {
        const streamLeft = target.formula.lastStream.slice(0, focusPosition);
        const streamRight = target.formula.lastStream.slice(focusPosition);
        const newFormulars = formulars.map((f) => {
          if (
            f.conditionId === currentIdFormula.conditionId &&
            f.formula.paramId === currentIdFormula.paramId
          ) {
            return {
              ...f,
              formula: {
                ...f.formula,
                formulaTokens: f.formula.formulaTokens.concat({
                  id: crypto.randomUUID(),
                  stream: streamLeft,
                  variable: newVariable,
                }),
                lastStream: streamRight,
              },
              isEdited: true,
            };
          }
          return f;
        });
        return newFormulars;
      }
    } else {
      const newFormulars = formulars.concat({
        conditionId: currentIdFormula.conditionId,
        formula: {
          paramId: currentIdFormula.paramId,
          formulaTokens: [
            {
              id: crypto.randomUUID(),
              stream: "",
              variable: newVariable,
            },
          ],
          lastStream: "",
          completeStream: "",
          variables: [],
          triggers: [],
        },
        isEdited: true,
      });
      return newFormulars;
    }
  } else {
    return formulars;
  }
}
