export type FreeSpace = {
  id: string;
  name: string;
  formulas: FormulaFreeS[];
};

export type FormulaFStatus = {
  formula: FormulaFreeS;
  isEdited: boolean;
};

export type FormulaFSId = {
  paramId: string;
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
