"use client";

import React, { useEffect, useState } from "react";
import ProjectNavbar from "../../components/ProjectNavbar";
import { ReactFlowProvider } from "@xyflow/react";
import { ProjectResponse } from "../../actions/getProjectWithID";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
} from "@/components/Tabs";
import { FileSliders, GitGraph } from "lucide-react";
import { Config, Type } from "../../types/config";
import { ProjectContext } from "../../contexts/ProjectContext";
import Editor from "../Editor";
import Configuration from "../Configuration";

interface Props {
  project: ProjectResponse;
}

export default function Project(props: Props) {
  const [onSave, setOnSave] = useState<() => void>(() => () => {});
  const [savePending, setSavePending] = useState(false);
  const [config, setConfig] = useState<Config>(() => {
    try {
      return JSON.parse(props.project.config) || {};
    } catch (e) {
      console.error("Failed to parse config:", e);
      return {};
    }
  });

  const [currentType, setCurrentType] = useState<Type | undefined>(undefined);

  useEffect(() => {
    if (currentType) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        types: prevConfig.types.map((type) =>
          type.id === currentType.id ? currentType : type
        ),
      }));
    }
  }, [currentType]);

  return (
    <ProjectContext.Provider
      value={{
        projId: props.project.id,
        flowStr: props.project.flow,
        onSave,
        setOnSave,
        setSavePending,
        config,
        setConfig: (newConfig) => {
          setConfig((prev) => ({ ...prev, ...newConfig }));
        },
        currentType,
        setCurrentType,
      }}
    >
      <ProjectNavbar
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
    </ProjectContext.Provider>
  );
}
