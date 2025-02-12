import { Position } from "@xyflow/react";
import { FormulaCondition } from "./Formula";

export type Interface = {
  id: string;
  name: string;
  description?: string;
  position: Position;
  formulaConditions: FormulaCondition[];
};
