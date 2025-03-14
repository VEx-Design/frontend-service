"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";
import { Config, ParameterGroup } from "../../libs/ClassConfig/types/Config";
import { Type } from "../../libs/ClassType/types/Type";
import addType from "../../libs/ClassConfig/addType";
import editType from "../../libs/ClassConfig/editType";
import getType from "../../libs/ClassConfig/getType";
import { Parameter } from "../../libs/ClassParameter/types/Parameter";
import { FreeSpace } from "../../libs/ClassConfig/types/FreeSpace";
import addParameter from "../../libs/ClassConfig/addParameter";
import getParameter from "../../libs/ClassConfig/getParameter";
import editFreeSpace from "../../libs/ClassConfig/editFreeSpace";
import addParameterGroup from "../../libs/ClassConfig/addParameterGroup";
import { ProjectResponse } from "../../actions/getProjectWithID";
import { BoundingConfiguration } from "../../libs/ClassBox/types/BoundingConfiguration";

interface ConfigContextValue {
  config: Config;
  configAction: ConfigAction;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  mapBounding: Map<string, BoundingConfiguration>;
  setMapBounding: (map: Map<string, BoundingConfiguration>) => void;
  blueprint: Map<string, BoundingConfiguration[]>;
  setBlueprint: (map: Map<string, BoundingConfiguration[]>) => void;
}

interface ConfigAction {
  addType: (type: Type) => void;
  editType: (type: Type) => void;
  getType: (typeId: string) => Type | undefined;
  addParameter: (parameter: Parameter) => void;
  getParameter: (parameterId: string) => Parameter | undefined;
  editFreeSpace: (freeSpace: FreeSpace) => void;
  addParameterGroup: (parameterGroup: ParameterGroup) => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  project: ProjectResponse;
}

export const ConfigProvider = ({ children, project }: ConfigProviderProps) => {
  // Parse project config once and memoize it
  const initialConfig = useMemo(() => {
    try {
      return project.config
        ? JSON.parse(project.config)
        : { types: [], parameters: [] };
    } catch (error) {
      console.error("Error parsing config:", error);
      return { types: [], parameters: [] };
    }
  }, [project.config]);

  const [config, setConfig] = useState<Config>(initialConfig);
  const [mapBounding, setMapBounding] = useState(
    new Map<string, BoundingConfiguration>()
  );
  const [blueprint, setBlueprint] = useState(
    new Map<string, BoundingConfiguration[]>()
  );

  const configAction: ConfigAction = useMemo(
    () => ({
      addType: (type: Type) => setConfig((prev) => addType(prev, type)),
      editType: (type: Type) => setConfig((prev) => editType(prev, type)),
      getType: (typeId: string) => getType(config, typeId),
      addParameter: (parameter: Parameter) =>
        setConfig((prev) => addParameter(prev, parameter)),
      getParameter: (parameterId: string) => getParameter(config, parameterId)!,
      editFreeSpace: (freeSpace: FreeSpace) =>
        setConfig((prev) => editFreeSpace(prev, freeSpace)),
      addParameterGroup: (parameterGroup: ParameterGroup) =>
        setConfig((prev) => addParameterGroup(prev, parameterGroup)),
    }),
    [config]
  );

  return (
    <ConfigContext.Provider
      value={{
        config,
        configAction,
        setConfig,
        mapBounding,
        setMapBounding,
        blueprint,
        setBlueprint,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
