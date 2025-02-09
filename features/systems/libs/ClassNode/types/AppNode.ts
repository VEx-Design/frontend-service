import { Node } from "@xyflow/react";
import { Object } from "../../ClassObject/types/Object";

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface AppNodeData {
  data: NodeData;
  [key: string]: string | number | boolean | object;
}

export interface NodeData {
  object: Object;
}
