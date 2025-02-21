import { FormulaFSId, FormulaFStatus } from "../types/FreeSpace";
import getFormula from "./getFormula";

export default function deleteVariable(
  formulas: FormulaFStatus[],
  currentIdFormula: FormulaFSId,
  focusIndex: number
) {
  const target = getFormula(formulas, currentIdFormula);
  if (target) {
    const streamLeft = target.formula.formulaTokens[focusIndex - 1].stream;
    if (focusIndex < target.formula.formulaTokens.length) {
      const newFormulars = formulas.map((f) => {
        if (f.formula.paramId === currentIdFormula.paramId) {
          return {
            ...f,
            formula: {
              ...f.formula,
              formulaTokens: f.formula.formulaTokens
                .filter((_, index) => index !== focusIndex - 1)
                .map((token, index) => {
                  if (index === focusIndex) {
                    return {
                      ...token,
                      stream: streamLeft,
                    };
                  }
                  return token;
                }),
            },
            isEdited: true,
          };
        }
        return f;
      });
      return newFormulars;
    } else {
      const newFormulars = formulas.map((f) => {
        if (f.formula.paramId === currentIdFormula.paramId) {
          return {
            ...f,
            formula: {
              ...f.formula,
              formulaTokens: f.formula.formulaTokens.filter(
                (_, index) => index !== focusIndex - 1
              ),
              lastStream: streamLeft,
            },
            isEdited: true,
          };
        }
        return f;
      });
      return newFormulars;
    }
  }
  return formulas;
}
