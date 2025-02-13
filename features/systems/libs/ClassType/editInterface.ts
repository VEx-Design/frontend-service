import { Interface } from "../ClassInterface/types/Interface";
import { Type } from "./types/Type";

export default function editInterface(
  type: Type,
  interfaceId: string,
  newInterface: Interface
): Type {
  return {
    ...type,
    interfaces: type.interfaces.map((item) =>
      item.id === interfaceId ? newInterface : item
    ),
  };
}
