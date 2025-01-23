"use client";

import React, { createContext, useEffect, useState } from "react";
import EditorNavbar from "./Editor/EditorNavbar";
import { ReactFlowProvider } from "@xyflow/react";
import Editor from "./Editor";
import { ProjectResponse } from "../actions/getProjectWithID";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
} from "@/components/Tabs";
import { FileSliders, GitGraph } from "lucide-react";
import Configuration from "./Configuration";
import getTypes, { TypesResponse } from "../actions/getTypes";

interface Props {
  project: ProjectResponse;
}

interface ProjectContextValue {
  projId: string;
  flowStr: string;
  onSave: () => void;
  setOnSave: (onSave: () => void) => void;
  setSavePending: (isPending: boolean) => void;
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

interface ConfigurationContextValue {
  types: TypesResponse[] | undefined;
  currentType: TypesResponse | undefined;
  setCurrentType: (type: TypesResponse) => void;
}

export const ConfigurationContext = createContext<
  ConfigurationContextValue | undefined
>(undefined);

export default function Project(props: Props) {
  const [onSave, setOnSave] = useState<() => void>(() => () => {});
  const [savePending, setSavePending] = useState(false);

  const [currentType, setCurrentType] = useState<TypesResponse | undefined>(
    undefined
  );
  const [types, setTypes] = useState<TypesResponse[]>();

  const fetchTypesforList = React.useCallback(async () => {
    try {
      const types = await getTypes();
      return types;
    } catch (error) {
      console.error("Error fetching projects for listing:", error);
    }
  }, []);

  useEffect(() => {
    fetchTypesforList().then((types) => {
      setTypes(types);
    });
  }, [fetchTypesforList]);

  return (
    <ProjectContext.Provider
      value={{
        projId: props.project.id,
        flowStr: props.project.flow,
        onSave,
        setOnSave,
        setSavePending,
      }}
    >
      <ConfigurationContext.Provider
        value={{ types, currentType, setCurrentType }}
      >
        <EditorNavbar
          title={props.project.name}
          onSave={onSave}
          savePending={savePending}
        />
        <Tabs type="side">
          <TabsList>
            <TabsTrigger name="Flow">
              <TabsTriggerIcon>
                <GitGraph />
              </TabsTriggerIcon>
            </TabsTrigger>
            <TabsTrigger name="Configuration">
              <TabsTriggerIcon>
                <FileSliders />
              </TabsTriggerIcon>
            </TabsTrigger>
          </TabsList>
          <TabsContent name="Flow">
            <ReactFlowProvider>
              <Editor />
            </ReactFlowProvider>
          </TabsContent>
          <TabsContent name="Configuration">
            <Configuration />
          </TabsContent>
        </Tabs>
      </ConfigurationContext.Provider>
    </ProjectContext.Provider>
  );
}
