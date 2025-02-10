import { Type } from "../ClassType/types/Type";
import { AppNode } from "./types/AppNode";

export function CreateObjectNode(
  type: Type,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "ObjectNode",
    data: {
      data: {
        object: {
          name: type.name,
          typeId: type.id,
          vars: type.properties.map((variable) => ({
            id: variable.id,
            name: variable.name,
            symbol: variable.symbol,
            value: "0",
          })),
        },
      },
    },
    position: position ?? { x: 0, y: 0 },
  };
}

export function CreateStarterNode(position: { x: number; y: number }): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "starter",
    data: { data: {} },
    position: position ?? { x: 0, y: 0 },
  };
}

export function CreateTerminalNode(position?: {
  x: number;
  y: number;
}): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "terminal",
    data: { data: {} },
    position: position ?? { x: 0, y: 0 },
  };
}
