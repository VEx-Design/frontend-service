"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProjectResponse } from "../actions/getProjectWithID";
import { Config } from "../libs/ClassConfig/types/Config";
import { Type } from "../libs/ClassType/types/Type";
import addType from "../libs/ClassConfig/addType";
import getType from "../libs/ClassConfig/getType";
import { Parameter } from "../libs/ClassParameter/types/Parameter";
import addParameter from "../libs/ClassConfig/addParameter";
import {
  EdgeChange,
  NodeChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { AppEdge } from "../libs/ClassEdge/types/AppEdge";
import { AppNode, NodeData } from "../libs/ClassNode/types/AppNode";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import saveFlow from "../actions/saveFlow";
import saveConfig from "../actions/saveConfig";
import editType from "../libs/ClassConfig/editType";
import { Flow } from "../libs/ClassFlow/types/Flow";

interface ProjectContextValue {
  projId: string;
  projName: string;
  onSave: () => void;
  setOnSave: (onSave: () => void) => void;
  savePending: boolean;
  setSavePending: (isPending: boolean) => void;
  config: Config;
  setConfig: (config: Config) => void;
  nodesState: NodesState;
  edgesState: EdgesState;
  configAction: ConfigAction;
  // execution
  executedFlow: Flow | undefined;
  setExecutedFlow: (flow: Flow | undefined) => void;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

interface NodesState {
  nodes: AppNode[];
  setNodes: (nodes: AppNode[]) => void;
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
}

interface EdgesState {
  edges: AppEdge[];
  setEdges: (edges: AppEdge[]) => void;
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => void;
}

interface ConfigAction {
  editNode: (nodeId: string, data: NodeData) => void;
  addType: (type: Type) => void;
  editType: (type: Type) => void;
  getType: (typeId: string) => Type;
  addParameter: (parameter: Parameter) => void;
  getParameter: (parameterId: string) => Parameter;
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

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

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

  const [executedFlow, setExecutedFlow] = useState<Flow | undefined>(undefined);

  useEffect(() => {
    const flow = JSON.parse(project.flow);
    if (!flow) return;
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
  }, [project.flow, setEdges, setNodes]);

  const configAction: ConfigAction = {
    editNode: (nodeId: string, data: NodeData) => {
      const node = nodes.find((node) => node.id === nodeId);
      if (!node) return;
      node.data.data = data;
      setNodes([...nodes]);
    },
    addType: (type: Type) => setConfig(addType(config, type)),
    editType: (type: Type) => setConfig(editType(config, type)),
    getType: (typeId: string) => getType(config, typeId),
    addParameter: (parameter: Parameter) =>
      setConfig(addParameter(config, parameter)),
    getParameter: (parameterId: string) => {
      return config.parameters.find((param) => param.id === parameterId)!;
    },
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      projId,
      flow,
      config,
    }: {
      projId: string;
      flow: { nodes: AppNode[]; edges: AppEdge[] };
      config: Config;
    }) => {
      await saveFlow(projId, flow);
      await saveConfig(projId, config);
    },
    onSuccess: () => {
      toast.success("Project saved", { id: "save-project" });
    },
    onError: () => {
      toast.error("Failed to save project", { id: "save-project" });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Saving project...", { id: "save-project" });
    mutate({ projId: project.id, flow: { nodes, edges }, config });
  }, [project.id, mutate, edges, nodes, config]);

  useEffect(() => {
    setOnSave(() => () => onSubmit());
    setSavePending(isPending);
  }, [isPending, setSavePending, onSubmit, setOnSave]);

  return (
    <ProjectContext.Provider
      value={{
        projId: project.id,
        projName: project.name,
        onSave,
        setOnSave,
        savePending,
        setSavePending,
        config,
        setConfig,
        nodesState: {
          nodes,
          setNodes,
          onNodesChange,
        },
        edgesState: {
          edges,
          setEdges,
          onEdgesChange,
        },
        configAction,
        executedFlow,
        setExecutedFlow,
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
