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

export interface ProjectNode {
  ID: string;
  name: string;
}
