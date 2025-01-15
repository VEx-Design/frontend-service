import { TypesResponse } from "../actions/getTypes";

export const getTypeById = (id: string, types: TypesResponse[]) => {
  return types.find((type) => type.id === id);
};
