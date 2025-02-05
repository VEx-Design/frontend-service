import { createContext } from "react";
import { Config, Type } from "../types/config";

interface ProjectContextValue {
  projId: string;
  flowStr: string;
  onSave: () => void;
  setOnSave: (onSave: () => void) => void;
  setSavePending: (isPending: boolean) => void;
  config: Config;
  setConfig: (config: Config) => void;
  currentType: Type | undefined;
  setCurrentType: (type: Type) => void;
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);
