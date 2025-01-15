"use client";

import React, { createContext, useState } from "react";
import EditorNavbar from "./Editor/EditorNavbar";
import { ReactFlowProvider } from "@xyflow/react";
import Editor from "./Editor";
import { ProjectResponse } from "../actions/getProjectWithID";

interface Props {
  project: ProjectResponse;
}

interface ProjectContextValue {
  projId: string;
  flowStr: string;
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
        setOnSave,
        setSavePending,
      }}
    >
      <EditorNavbar
        title={props.project.name}
        onSave={onSave}
        savePending={savePending}
      />
      <ReactFlowProvider>
        <Editor />
      </ReactFlowProvider>
    </ProjectContext.Provider>
  );
}
