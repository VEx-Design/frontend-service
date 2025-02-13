import { Position } from "@xyflow/react";
import { Interface } from "./types/Interface";

export default function editPosition(
  inter: Interface,
  newPosition: Position
): Interface {
  inter.position = newPosition;
  return inter;
}
