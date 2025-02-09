import { Position } from "@xyflow/react";
import { Interface } from "./types/Interface";

export default function editLocation(
  inter: Interface,
  newLocation: Position
): Interface {
  inter.location = newLocation;
  return inter;
}
