import { Type } from "../ClassType/types/Type";
import { Config } from "./types/Config";

export default function getType(config: Config, typeId: string): Type {
  const foundType = config.types.find((type) => type.id === typeId);
  if (!foundType) {
    throw new Error(`Type with id ${typeId} not found`);
  }
  return foundType;
}
