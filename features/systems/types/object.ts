import { TypesResponse } from "../actions/getTypes";

export interface NodeData {
  type?: TypesResponse;
  object?: ObjectType;
  output?: NodeTransferType[];
}

interface ObjectType {
  name: string;
  vars: ObjectVariableType[];
}

export interface ObjectVariableType {
  id: string;
  name: string;
  symbol: string;
  value: string;
}

export interface NodeTransferType {
  handleId: string;
  param: NodeParamType[];
}

export interface NodeParamType {
  id: string;
  name: string;
  symbol: string;
  value: string;
}
