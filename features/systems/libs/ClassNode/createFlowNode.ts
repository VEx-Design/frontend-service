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
          name: type.displayName,
          typeId: type.id,
          vars: type.properties.map((prop) => ({
            propId: prop.id,
            value: 0,
            unitPrefixId: "MILLI",
          })),
          interfaces: [],
        },
        rotate: 0,
      },
    },
    position: position ?? { x: 0, y: 0 },
  };
}

export function CreateStarterNode(position: { x: number; y: number }): AppNode {
  const randomColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

  return {
    id: crypto.randomUUID(),
    type: "starter",
    data: {
      data: {
        initials: [
          {
            id: crypto.randomUUID(),
            params: [],
            path: {
              id: crypto.randomUUID(),
              color: randomColor,
            },
          },
        ],
        rotate: 0,
      },
    },
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
    data: { data: { rotate: 0 } },
    position: position ?? { x: 0, y: 0 },
  };
}
