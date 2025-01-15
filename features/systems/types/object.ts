import { TypesResponse } from "../actions/getTypes";

export interface NodeData {
  type?: TypesResponse;
  object?: ObjectType;
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
