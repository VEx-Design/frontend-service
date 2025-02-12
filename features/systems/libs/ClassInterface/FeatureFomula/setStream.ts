import { FormulaId, FormulaStatus } from "../types/Formula";
import getFormular from "./getFormular";

export default function setStream(
  formulars: FormulaStatus[],
  currentIdFormula: FormulaId,
  stream: string,
  focusIndex: number
): FormulaStatus[] {
  const target = getFormular(formulars, currentIdFormula);
  if (currentIdFormula) {
    if (target) {
      const newFormulars = formulars.map((f) => {
        if (
          f.conditionId === currentIdFormula.conditionId &&
          f.formula.paramId === currentIdFormula.paramId
        ) {
          if (focusIndex < f.formula.formulaTokens.length) {
            return {
              ...f,
              formula: {
                ...f.formula,
                formulaTokens: f.formula.formulaTokens.map((token, index) => {
                  if (index === focusIndex) {
                    return {
                      ...token,
                      stream: stream,
                    };
                  }
                  return token;
                }),
              },
              isEdited: true,
            };
          } else {
            return {
              ...f,
              formula: {
                ...f.formula,
                lastStream: stream,
              },
              isEdited: true,
            };
          }
        }
        return f;
      });
      return newFormulars;
    } else {
      const newFormulars = formulars.concat({
        conditionId: currentIdFormula.conditionId,
        formula: {
          paramId: currentIdFormula.paramId,
          formulaTokens: [],
          lastStream: stream,
        },
        isEdited: true,
      });
      return newFormulars;
    }
  } else {
    return formulars;
  }
}
