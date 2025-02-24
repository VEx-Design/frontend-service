import { Light } from "../../ClassLight/types/Light";

export interface OpticalObject {
  name: string;
  typeId: string;
  vars: ObjectVariable[];
  interfaces: ObjectInterface[];
}

export interface ObjectVariable {
  propId: string;
  value: number;
}

export interface ObjectInterface {
  interfaceId: string;
  input: Light[];
  output: Light[];
}
