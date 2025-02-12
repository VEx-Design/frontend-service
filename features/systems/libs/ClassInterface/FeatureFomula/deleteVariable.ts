import { FormulaId, FormulaStatus } from "../types/Formula";

export default function deleteVariable(
  formula: FormulaStatus[],
  currentIdFormula: FormulaId,
  focusIndex: number
) {
  const target = formula.find(
    (f) =>
      f.conditionId === currentIdFormula.conditionId &&
      f.formula.paramId === currentIdFormula.paramId
  );
  if (target) {
    const streamLeft = target.formula.formulaTokens[focusIndex - 1].stream;
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
  return formula;
}
