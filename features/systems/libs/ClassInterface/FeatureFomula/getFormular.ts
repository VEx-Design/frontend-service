import { FormulaId, FormulaStatus } from "../types/Formula";

export default function getFormular(
  formulas: FormulaStatus[],
  formulaId: FormulaId
) {
  return formulas.find(
    (f) =>
      f.conditionId === formulaId.conditionId &&
      f.formula.paramId === formulaId.paramId
  );
}
