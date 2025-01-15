import { Node } from "@xyflow/react";
import { NodeData } from "./object";

export interface AppNodeData {
  data: NodeData;
  [key: string]: string | number | boolean | object;
}

export interface AppNode extends Node {
  data: AppNodeData;
}
