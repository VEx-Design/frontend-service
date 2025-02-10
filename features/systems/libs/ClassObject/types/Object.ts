export interface Object {
  name: string;
  typeId: string;
  vars: ObjectVariable[];
}

export interface ObjectVariable {
  propId: string;
  value: number;
}
