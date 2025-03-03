import { FormulaFSId, FreeSpace } from "./types/FreeSpace";

export default function getFormulaFreeSpace(
  currentFreeSpace: FreeSpace,
  formulaId: FormulaFSId
) {
  return currentFreeSpace.formulas.find((f) => f.paramId === formulaId.paramId);
}
