import { Config } from "../ClassConfig/types/Config";
import { Interface } from "./types/Interface";

export default function getInterfaceInfo(
  config: Config,
  id: string
): Interface | undefined {
  return config.types
    .find((type) =>
      type.interfaces.some((interfaceItem) => interfaceItem.id === id)
    )
    ?.interfaces.find((interfaceItem) => interfaceItem.id === id);
}
