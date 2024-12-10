export interface ObjectNode {
  name: string;
  type: ObjectType;
}

interface ObjectType {
  name: string;
  vars: {
    name: string;
    value: number;
  }[];
}
