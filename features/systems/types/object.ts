export interface ObjectNode {
  name: string;
  type: Type;
}

interface Type {
  name: string;
  vars: {
    name: string;
    value: number;
  }[];
}
