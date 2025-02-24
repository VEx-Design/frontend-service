import { Connection } from "@xyflow/react";
import { AppEdge } from "./types/AppEdge";

export function CreateEdgeLight(connection: Connection): AppEdge {
  return {
    ...connection,
    animated: true,
    id: crypto.randomUUID(),
    data: {
      data: {
        distance: "25",
        focusDistance: 0,
        locked: false,
        light: [],
      },
    },
  };
}
