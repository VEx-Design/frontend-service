import { Variable } from "lucide-react";

export type FormulaStatus = {
  conditionId: string;
  formula: Formula;
  isEdited: boolean;
};

export type FormulaId = {
  conditionId: string;
  paramId: string;
};

export type FormulaCondition = {
  id: string;
  type: "DEFAULT" | "TRIGGER AT";
  interfaceId?: string;
  formulas: Formula[];
};

export type Formula = {
  paramId: string;
  formulaTokens: FormulaToken[];
  lastStream: string;
  completeStream: string;
  variables: Variable[];
  triggers: string[];
};

export type FormulaToken = {
  id: string;
  stream: string;
  variable: Variable;
};

export type Variable = {
  id: string;
  type: "prop" | "interface";
  propId?: string;
  interfaceId?: string;
  paramId?: string;
};
