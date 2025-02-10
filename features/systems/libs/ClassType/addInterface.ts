import { Position } from "@xyflow/react";
import { Type } from "./types/Type";

export default function addInterface(type: Type): Type {
  type.interface.push({
    id: crypto.randomUUID(),
    name: `Interface ${type.interface.length + 1}`,
    location: Position.Left,
  });
  return type;
}
