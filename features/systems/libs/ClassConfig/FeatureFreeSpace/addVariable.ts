import { FormulaFSId, FormulaFStatus, VariableFreeS } from "../types/FreeSpace";
import getFormula from "./getFormula";

export default function addVariable(
  formulars: FormulaFStatus[],
  currentIdFormula: FormulaFSId,
  focusIndex: number,
  focusPosition: number,
  newVariable: VariableFreeS
): FormulaFStatus[] {
  const target = getFormula(formulars, currentIdFormula);
  if (currentIdFormula) {
    if (target) {
      if (focusIndex < target.formula.formulaTokens.length) {
        const streamLeft = target.formula.formulaTokens[
          focusIndex
        ].stream.slice(0, focusPosition);
        const streamRight =
          target.formula.formulaTokens[focusIndex].stream.slice(focusPosition);
        const newFormulars = formulars.map((f) => {
          if (f.formula.paramId === currentIdFormula.paramId) {
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
          if (f.formula.paramId === currentIdFormula.paramId) {
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
        },
        isEdited: true,
      });
      return newFormulars;
    }
  } else {
    return formulars;
  }
}
