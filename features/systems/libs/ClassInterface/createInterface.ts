import { Position } from "@xyflow/react";
import { Type } from "../../types/config";

export default function createInterface(currentType: Type): Promise<Type> {
  currentType.interface.push({
    id: crypto.randomUUID(),
    name: `Interface ${currentType.interface.length + 1}`,
    location: Position.Left,
  });
  return Promise.resolve(currentType);
}
