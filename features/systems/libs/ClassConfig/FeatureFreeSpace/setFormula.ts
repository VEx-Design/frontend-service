import { FormulaFStatus, FreeSpace } from "../types/FreeSpace";

export default function setFormula(
  currentFreeSpace: FreeSpace,
  formulaStatus: FormulaFStatus
): FreeSpace {
  const index = currentFreeSpace.formulas.findIndex(
    (f) => f.paramId === formulaStatus.formula.paramId
  );

  const newFreeSpace = { ...currentFreeSpace };
  const newFormula = {
    ...formulaStatus.formula,
    completeStream:
      formulaStatus.formula.formulaTokens.reduce((acc, token, index) => {
        acc += token.stream + `x[${index + 1}]`;
        return acc;
      }, "") + formulaStatus.formula.lastStream,
    variables: formulaStatus.formula.formulaTokens.map(
      (token) => token.variable
    ),
  };
  if (index === -1) {
    newFreeSpace.formulas.push(newFormula);
  } else {
    newFreeSpace.formulas[index] = newFormula;
  }
  return newFreeSpace;
}
