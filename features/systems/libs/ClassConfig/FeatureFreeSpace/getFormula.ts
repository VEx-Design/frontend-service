import { FormulaFSId, FormulaFStatus } from "../types/FreeSpace";

export default function getFormula(
  formulas: FormulaFStatus[],
  formulaId: FormulaFSId
) {
  return formulas.find((f) => f.formula?.paramId === formulaId.paramId);
}
