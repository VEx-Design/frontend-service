import { Light } from "../ClassLight/types/Light";
import { OpticalObject } from "./types/Object";

export default function setObjectOutput(
  object: OpticalObject,
  interfaceId: string,
  formInterfaceId: string,
  output: Light[]
): OpticalObject {
  return {
    ...object,
    interfaces: object.interfaces.map((interfaceItem) => {
      if (interfaceItem.interfaceId === interfaceId) {
        return {
          ...interfaceItem,
          output: interfaceItem.output
            .filter((item) => item.formInterfaceId !== formInterfaceId)
            .concat(output),
        };
      }
      return interfaceItem;
    }),
  };
}
