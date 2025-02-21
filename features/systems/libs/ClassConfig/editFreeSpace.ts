import { Config } from "./types/Config";
import { FreeSpace } from "./types/FreeSpace";

export default function editFreeSpace(
  config: Config,
  editedFreeSpace: FreeSpace
): Config {
  const newFreeSpaces = config.freeSpaces.map((freeSpace) => {
    if (freeSpace.id === editedFreeSpace.id) {
      return editedFreeSpace;
    }
    return freeSpace;
  });

  return {
    ...config,
    freeSpaces: newFreeSpaces,
  };
}
