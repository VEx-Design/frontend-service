"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ProjectResponse } from "../actions/getProjectWithID";

// type
import { Config } from "../libs/ClassConfig/types/Config";
import { Type } from "../libs/ClassType/types/Type";
import addType from "../libs/ClassConfig/addType";
import getType from "../libs/ClassConfig/getType";
import { Parameter } from "../libs/ClassParameter/types/Parameter";
import addParameter from "../libs/ClassConfig/addParameter";

interface ProjectContextValue {
  projId: string;
  projName: string;
  flowStr: string;
  onSave: () => void;
  setOnSave: (onSave: () => void) => void;
  savePending: boolean;
  setSavePending: (isPending: boolean) => void;
  config: Config;
  setConfig: (config: Config) => void;
  configAction: ConfigAction;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

interface ConfigAction {
  addType: (type: Type) => void;
  getType: (typeId: string) => Type;
  addParameter: (parameter: Parameter) => void;
}

interface ProjectProviderProps {
  children: ReactNode;
  project: ProjectResponse;
}

export const ProjectProvider = ({
  children,
  project,
}: ProjectProviderProps) => {
  const [onSave, setOnSave] = useState<() => void>(() => () => {});
  const [config, setConfig] = useState<Config>(() => {
    try {
      return project.config
        ? JSON.parse(project.config)
        : { types: [], parameters: [] };
    } catch (error) {
      console.error("Error parsing config:", error);
      return { types: [], parameters: [] };
    }
  });
  const [savePending, setSavePending] = useState<boolean>(false);

  const configAction: ConfigAction = {
    addType: (type: Type) => setConfig(addType(config, type)),
    getType: (typeId: string) => getType(config, typeId),
    addParameter: (parameter: Parameter) =>
      setConfig(addParameter(config, parameter)),
  };

  return (
    <ProjectContext.Provider
      value={{
        projId: project.id,
        projName: project.name,
        flowStr: project.flow || "",
        onSave,
        setOnSave,
        savePending,
        setSavePending,
        config,
        setConfig,
        configAction,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
