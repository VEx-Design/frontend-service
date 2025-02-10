import { Type } from "../ClassType/types/Type";
import { Config } from "./types/Config";

export default function editType(config: Config, editedType: Type): Config {
  const newTypes = config.types.map((type) => {
    if (type.id === editedType.id) {
      return editedType;
    }
    return type;
  });

  return {
    ...config,
    types: newTypes,
  };
}
