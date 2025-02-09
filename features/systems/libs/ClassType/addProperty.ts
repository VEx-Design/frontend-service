import { Property, Type } from "./types/Type";

export default function addProperty(type: Type, property: Property): Type {
  return {
    ...type,
    properties: [...type.properties, property],
  };
}
