export interface Object {
  name: string;
  typeId: string;
  vars: ObjectVariable[];
}

export interface ObjectVariable {
  id: string;
  name: string;
  symbol: string;
  value: string;
}
