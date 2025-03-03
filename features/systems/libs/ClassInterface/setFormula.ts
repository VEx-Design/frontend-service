import { FormulaStatus } from "./types/Formula";
import { Interface } from "./types/Interface";

export default function setFormula(
  currentInterface: Interface,
  formula: FormulaStatus
): Interface {
  const conditionIndex = currentInterface.formulaConditions.findIndex(
    (cond) => cond.id === formula.conditionId
  );

  const index = currentInterface.formulaConditions[
    conditionIndex
  ].formulas.findIndex((f) => f.paramId === formula.formula.paramId);

  const newInterface = { ...currentInterface };
  const newFormula = {
    ...formula.formula,
    completeStream:
      formula.formula.formulaTokens.reduce((acc, token, index) => {
        acc += token.stream + `x[${index + 1}]`;
        return acc;
      }, "") + formula.formula.lastStream,
    variables: formula.formula.formulaTokens.map((token) => token.variable),
    triggers: Array.from(
      new Set(
        formula.formula.formulaTokens
          .map((token) => token.variable.interfaceId)
          .filter((id): id is string => id !== undefined)
      )
    ),
  };
  if (index === -1) {
    newInterface.formulaConditions[conditionIndex].formulas.push(newFormula);
  } else {
    newInterface.formulaConditions[conditionIndex].formulas[index] = newFormula;
  }
  return newInterface;
}
