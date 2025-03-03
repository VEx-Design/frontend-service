import { Node } from "@xyflow/react";
import { OpticalObject } from "../../ClassObject/types/Object";
import { Light } from "../../ClassLight/types/Light";

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface AppNodeData {
  data: NodeData;
  [key: string]: string | number | boolean | object;
}

export interface NodeData {
  object?: OpticalObject;
  initials?: Light[];
}
