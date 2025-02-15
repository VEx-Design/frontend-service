import { FormulaStatus } from "./types/Formula";
import { Interface } from "./types/Interface";

export default function setFormula(
  currentInterface: Interface,
  formula: FormulaStatus
) {
  const conditionIndex = currentInterface.formulaConditions.findIndex(
    (cond) => cond.id === formula.conditionId
  );

  const index = currentInterface.formulaConditions[
    conditionIndex
  ].formulas.findIndex((f) => f.paramId === formula.formula.paramId);

  const newInterface = { ...currentInterface };
  if (index === -1) {
    newInterface.formulaConditions[conditionIndex].formulas.push(
      formula.formula
    );
  } else {
    newInterface.formulaConditions[conditionIndex].formulas[index] =
      formula.formula;
  }
  return newInterface;
}
