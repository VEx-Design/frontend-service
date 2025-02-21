import { FormulaFStatus, FreeSpace } from "../types/FreeSpace";

export default function setFormula(
  currentFreeSpace: FreeSpace,
  formulaStatus: FormulaFStatus
): FreeSpace {
  const newFreeSpace = {
    ...currentFreeSpace,
    formulas: [formulaStatus.formula],
  };
  return newFreeSpace;
}
