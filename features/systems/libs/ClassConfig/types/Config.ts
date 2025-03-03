import { Parameter } from "../../ClassParameter/types/Parameter";
import { Type } from "../../ClassType/types/Type";
import { FreeSpace } from "./FreeSpace";

export type Config = {
  types: Type[];
  parameters: Parameter[];
  parameterGroups: ParameterGroup[];
  freeSpaces: FreeSpace[];
};

export type ParameterGroup = {
  id: string;
  name: string;
  parameterIds: string[];
};
