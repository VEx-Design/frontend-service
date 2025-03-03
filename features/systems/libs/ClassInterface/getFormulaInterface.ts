import { FormulaId } from "./types/Formula";
import { Interface } from "./types/Interface";

export default function getFormulaInterface(
  currentInterface: Interface,
  formulaId: FormulaId
) {
  return currentInterface.formulaConditions
    .find((cond) => cond.id === formulaId.conditionId)
    ?.formulas.find((f) => f.paramId === formulaId.paramId);
}
