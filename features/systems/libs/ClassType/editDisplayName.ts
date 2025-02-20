import { Type } from "./types/Type";

export default function editDisplayName(type: Type, displayName: string): Type {
  return {
    ...type,
    displayName,
  };
}
