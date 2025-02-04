import { Type } from "../types/config";

export const getTypeById = (id: string, types: Type[]) => {
  return types.find((type) => type.id === id);
};
