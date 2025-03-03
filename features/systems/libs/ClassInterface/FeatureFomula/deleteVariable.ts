import { FormulaId, FormulaStatus } from "../types/Formula";

export default function deleteVariable(
  formula: FormulaStatus[],
  currentIdFormula: FormulaId,
  focusIndex: number
): { formula: FormulaStatus[]; position: number } {
  const target = formula.find(
    (f) =>
      f.conditionId === currentIdFormula.conditionId &&
      f.formula.paramId === currentIdFormula.paramId
  );
  if (target) {
    const streamLeft = target.formula.formulaTokens[focusIndex - 1].stream;
    const position = streamLeft.length;
    if (focusIndex < target.formula.formulaTokens.length) {
      const newFormulars = formula.map((f) => {
        if (
          f.conditionId === currentIdFormula.conditionId &&
          f.formula.paramId === currentIdFormula.paramId
        ) {
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
      return { formula: newFormulars, position };
    } else {
      const newFormulars = formula.map((f) => {
        if (
          f.conditionId === currentIdFormula.conditionId &&
          f.formula.paramId === currentIdFormula.paramId
        ) {
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
      return { formula: newFormulars, position };
    }
  }
  return { formula, position: 0 };
}
