import { Position } from "@xyflow/react";
import { Type } from "./types/Type";

export default function addInterface(type: Type): Type {
  type.interfaces.push({
    id: crypto.randomUUID(),
    name: `Interface ${type.interfaces.length + 1}`,
    position: Position.Left,
    formulaConditions: [
      { id: crypto.randomUUID(), type: "DEFAULT", formulas: [] },
    ],
  });
  return type;
}
