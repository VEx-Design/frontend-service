import { Type } from "./types/Type";

export default function editName(type: Type, name: string): Type {
  return {
    ...type,
    name,
  };
}
