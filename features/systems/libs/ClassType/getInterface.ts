import { Interface } from "../ClassInterface/types/Interface";
import { Type } from "./types/Type";

export default function getInterface(
  currentType: Type,
  interfaceId: string
): Interface | undefined {
  return currentType?.interfaces.find((inter) => inter.id === interfaceId);
}
