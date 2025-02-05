import { useState, ReactNode } from "react";
import { ProjectContext } from "./ProjectContext";
import { Config, Type } from "../types/config";

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [projId, setProjId] = useState<string>("default-id");
  const [flowStr, setFlowStr] = useState<string>("");
  const [onSave, setOnSave] = useState<() => void>(() => () => {});
  const [config, setConfig] = useState<Config>({
    /* Default Config */
  });
  const [currentType, setCurrentType] = useState<Type | undefined>(undefined);
  const [savePending, setSavePending] = useState<boolean>(false);

  return (
    <ProjectContext.Provider
      value={{
        projId,
        flowStr,
        onSave,
        setOnSave,
        setSavePending,
        config,
        setConfig,
        currentType,
        setCurrentType,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
