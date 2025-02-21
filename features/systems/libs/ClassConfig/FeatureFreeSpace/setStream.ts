import { FormulaFSId, FormulaFStatus } from "../types/FreeSpace";
import getFormula from "./getFormula";

export default function setStream(
  formulas: FormulaFStatus[],
  currentIdFormula: FormulaFSId,
  stream: string,
  focusIndex: number
): FormulaFStatus[] {
  const target = getFormula(formulas, currentIdFormula);
  if (currentIdFormula) {
    if (target) {
      const newFormulars = formulas.map((f) => {
        if (f.formula.paramId === currentIdFormula.paramId) {
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
      const newFormulars = formulas.concat({
        formula: {
          paramId: currentIdFormula.paramId,
          formulaTokens: [],
          lastStream: stream,
          completeStream: "",
          variables: [],
        },
        isEdited: true,
      });
      return newFormulars;
    }
  } else {
    return formulas;
  }
}
