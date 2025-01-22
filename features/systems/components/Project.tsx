"use client";

import React, { createContext, useState } from "react";
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

export default function Project(props: Props) {
  const [onSave, setOnSave] = useState<() => void>(() => () => {});
  const [savePending, setSavePending] = useState(false);

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
    </ProjectContext.Provider>
  );
}
