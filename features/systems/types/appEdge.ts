import { Edge } from "@xyflow/react";
import { EdgeData } from "./light";

export interface AppEdgeData {
  data: EdgeData;
  [key: string]: string | number | boolean | object;
}

export interface AppEdge extends Edge {
  data: AppEdgeData;
}
