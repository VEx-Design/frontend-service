import { FormulaFSId, FormulaFStatus } from "../types/FreeSpace";
import getFormula from "./getFormula";

export default function deleteVariable(
  formulas: FormulaFStatus[],
  currentIdFormula: FormulaFSId,
  focusIndex: number
): { formulas: FormulaFStatus[]; position: number } {
  const target = getFormula(formulas, currentIdFormula);
  if (target) {
    const streamLeft = target.formula.formulaTokens[focusIndex - 1].stream;
    const position = streamLeft.length;
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
                  if (index === focusIndex - 1) {
                    return {
                      ...token,
                      stream: streamLeft + token.stream,
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
      return { formulas: newFormulars, position };
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
              lastStream: streamLeft + f.formula.lastStream,
            },
            isEdited: true,
          };
        }
        return f;
      });
      return { formulas: newFormulars, position };
    }
  }
  return { formulas, position: 0 };
}
