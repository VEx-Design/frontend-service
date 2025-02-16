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
}

export interface ObjectInput {
  paramId: string;
  value: number;
}
