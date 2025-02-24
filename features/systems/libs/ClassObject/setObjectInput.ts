import { Light } from "../ClassLight/types/Light";
import { OpticalObject } from "./types/Object";

export default function setObjectInput(
  object: OpticalObject,
  interfaceId: string,
  input: Light[]
): OpticalObject {
  return {
    ...object,
    interfaces: object.interfaces.map((interfaceItem) => {
      if (interfaceItem.interfaceId === interfaceId) {
        return {
          ...interfaceItem,
          input,
        };
      }
      return interfaceItem;
    }),
  };
}
