import { Formula } from "../../ClassInterface/types/Formula";

export type FormulaFStatus = {
  formula: Formula;
  isEdited: boolean;
};

export type FreeSpace = {
  id: string;
  name: string;
  formulas: FormulaFStatus[];
};

export type FormulaFreeS = {
  paramId: string;
  formulaTokens: FormulaFreeSToken[];
  lastStream: string;
  completeStream: string;
  variables: VariableFreeS[];
};

export type FormulaFreeSToken = {
  id: string;
  stream: string;
  variable: VariableFreeS;
};

export type VariableFreeS = {
  id: string;
  type: "distance" | "parameter";
  paramId?: string;
};
