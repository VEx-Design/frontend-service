import { Type } from "../ClassType/types/Type";
import { Config } from "./types/Config";

export default function addType(config: Config, type: Type): Config {
  return {
    ...config,
    types: [...config.types, type],
  };
}
