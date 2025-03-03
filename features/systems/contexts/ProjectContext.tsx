"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProjectResponse } from "../actions/getProjectWithID";
import { Config, ParameterGroup } from "../libs/ClassConfig/types/Config";
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
import { BoundingConfiguration } from "../libs/ClassBox/types/BoundingConfiguration";
import { FreeSpace } from "../libs/ClassConfig/types/FreeSpace";
import editFreeSpace from "../libs/ClassConfig/editFreeSpace";
import addParameterGroup from "../libs/ClassConfig/addParameterGroup";
import getParameter from "../libs/ClassConfig/getParameter";
import { debounce } from "lodash"; // Debounce function to optimize saves

interface ProjectContextValue {
  projId: string;
  projName: string;
  onSave: () => void;
  savePending: boolean;
  config: Config;
  nodesState: NodesState;
  edgesState: EdgesState;
  configAction: ConfigAction;
  executedFlow: Flow | undefined;
  setExecutedFlow: (flow: Flow | undefined) => void;
  // Bounding
  mapBounding: Map<string, BoundingConfiguration>;
  setMapBounding: (map: Map<string, BoundingConfiguration>) => void;
  blueprint: Map<string, BoundingConfiguration[]>;
  setBlueprint: (map: Map<string, BoundingConfiguration[]>) => void;
  
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
  editFreeSpace: (freeSpace: FreeSpace) => void;
  addParameterGroup: (parameterGroup: ParameterGroup) => void;
}

interface ProjectProviderProps {
  children: ReactNode;
  project: ProjectResponse;
}

export const ProjectProvider = ({
  children,
  project,
}: ProjectProviderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const [savePending, setSavePending] = useState(false);
  const [executedFlow, setExecutedFlow] = useState<Flow | undefined>(undefined);

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

  // Initialize nodes and edges once
  useEffect(() => {
    try {
      const flow = JSON.parse(project.flow);
      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    } catch (error) {
      console.error("Error parsing flow:", error);
    }
  }, [project.flow, setEdges, setNodes]);

  // Config Actions
  const configAction: ConfigAction = useMemo(
    () => ({
      editNode: (nodeId: string, data: NodeData) => {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, data } }
              : node
          )
        );
      },
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
    [config, setNodes]
  );

  // Save project mutation
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

  // Debounced save function
  const debouncedSave = useMemo(() => debounce(() => mutate(), 500), [mutate]);

  // Trigger save
  const onSave = useCallback(() => {
    toast.loading("Saving project...", { id: "save-project" });
    setSavePending(true);
    debouncedSave();
  }, [debouncedSave]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      projId: project.id,
      projName: project.name,
      onSave,
      savePending,
      config,
      nodesState: { nodes, setNodes, onNodesChange },
      edgesState: { edges, setEdges, onEdgesChange },
      configAction,
      executedFlow,
      setExecutedFlow,
    }),
    [
      project.id,
      project.name,
      onSave,
      savePending,
      config,
      nodes,
      setNodes,
      onNodesChange,
      edges,
      setEdges,
      onEdgesChange,
      configAction,
      executedFlow,
      mapBounding,
      setMapBounding,
      blueprint,
      setBlueprint,
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
