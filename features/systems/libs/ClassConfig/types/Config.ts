import { Parameter } from "../../ClassParameter/types/Parameter";
import { Type } from "../../ClassType/types/Type";
import { FreeSpace } from "./FreeSpace";

export type Config = {
  types: Type[];
  parameters: Parameter[];
  freeSpaces: FreeSpace[];
};
