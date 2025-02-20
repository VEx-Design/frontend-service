export interface Object {
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
  input: ObjectInput[];
  output: ObjectOutput[];
}

export interface ObjectInput {
  paramId: string;
  value: number;
}

export interface ObjectOutput {
  paramId: string;
  value: number;
}
