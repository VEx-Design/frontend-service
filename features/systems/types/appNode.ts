import { Node } from "@xyflow/react";
import { TaskParam } from "./task";

export interface AppNodeData {
  [key: string]: string | number | boolean | object;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
