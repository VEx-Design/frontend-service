import { Edge } from "@xyflow/react";
import { Light } from "../../ClassLight/types/Light";

export interface AppEdge extends Edge {
  data: AppEdgeData;
}

export interface AppEdgeData {
  data: EdgeData;
  [key: string]: string | number | boolean | object;
}

export interface EdgeData {
  light?: Light;
}
