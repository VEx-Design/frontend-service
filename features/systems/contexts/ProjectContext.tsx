"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProjectResponse } from "../actions/getProjectWithID";
import { Flow } from "../libs/ClassFlow/types/Flow";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import saveFlow from "../actions/saveFlow";
import saveConfig from "../actions/saveConfig";
import { debounce } from "lodash";
import { useNodes } from "./ProjectWrapper/NodesContext";
import { useEdges } from "./ProjectWrapper/EdgesContext";
import { useConfig } from "./ProjectWrapper/ConfigContext";
import calculate from "../libs/ClassFlow/calculation/calculate";

interface ProjectProviderProps {
  children: React.ReactNode;
  project: ProjectResponse;
}

interface ProjectContextValue {
  projId: string;
  projName: string;
  projectFlow: string;
  onSave: () => void;
  savePending: boolean;
  executedFlow: Flow | undefined;
  executeProject: () => void;
  isTriggered: boolean;
  setIsTriggered: (isTriggered: boolean) => void;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

export const ProjectProvider = ({
  children,
  project,
}: ProjectProviderProps) => {
  const [savePending, setSavePending] = useState(false);
  const [executedFlow, setExecutedFlow] = useState<Flow | undefined>(undefined);
  const [isTriggered, setIsTriggered] = useState(false);

  // Use nodes, edges, and config from separate contexts
  const { nodes } = useNodes();
  const { edges } = useEdges();
  const { config } = useConfig();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await saveFlow(project.id, { nodes, edges });
      await saveConfig(project.id, config);
    },
    onSuccess: () => {
      toast.success("Project saved", { id: "save-project" });
      setSavePending(false);
    },
    onError: () => {
      toast.error("Failed to save project", { id: "save-project" });
      setSavePending(false);
    },
  });

  const debouncedSave = useMemo(() => debounce(() => mutate(), 500), [mutate]);

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  const onSave = useCallback(() => {
    toast.loading("Saving project...", { id: "save-project" });
    setIsTriggered(true);
    setSavePending(true);
    while (isTriggered);
    debouncedSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSave]);

  const executeProject = useCallback(() => {
    toast.loading("Executing project...", { id: "execute-project" });
    setIsTriggered(true);
    while (isTriggered);
    setExecutedFlow(calculate({ nodes: nodes, edges: edges }, config));
    toast.success("Project executed", { id: "execute-project" });
  }, [isTriggered, nodes, edges, config]);

  const contextValue = useMemo(
    () => ({
      projId: project.id,
      projName: project.name,
      projectFlow: project.flow,
      onSave,
      savePending,
      executedFlow,
      executeProject,
      isTriggered,
      setIsTriggered,
    }),
    [
      project.id,
      project.name,
      project.flow,
      onSave,
      savePending,
      executeProject,
      executedFlow,
      isTriggered,
    ]
  );

  return (
    <ProjectContext.Provider value={contextValue}>
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
