import { TypesResponse } from "../actions/getTypes";

export interface NodeData {
  type?: TypesResponse;
  object?: ObjectType;
  input?: NodeTransferType[];
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
  id: string;
  name: string;
  symbol: string;
  value: string;
}
