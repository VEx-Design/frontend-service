import { createContext } from "react";
import { Interface } from "../types/config";

interface ConfigConsoleContextValue {
  currentInterface: Interface | undefined;
  setCurrentInterface: (type: Interface) => void;
}

export const ConfigContext = createContext<
  ConfigConsoleContextValue | undefined
>(undefined);
