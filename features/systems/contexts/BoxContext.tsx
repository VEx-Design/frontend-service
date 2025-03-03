import {
  EdgeChange,
  FitView,
  NodeChange,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { AppNode, NodeData } from "../libs/ClassNode/types/AppNode";
import { AppEdge, EdgeData } from "../libs/ClassEdge/types/AppEdge";
import { useProject } from "./ProjectContext";
import { createContext, use, useEffect, useState } from "react";
import React from "react";
import { BoundingConfiguration } from "../libs/ClassBox/types/BoundingConfiguration";
import { Config } from "../libs/ClassConfig/types/Config";

interface BoxContextValue {
  focusNode: AppNode | undefined;
  setFocusNode: (node: AppNode | undefined) => void;
  focusPoint: string;
  setFocusPoint: (string: string) => void;
  nodesState: NodesState;
  edgesState: EdgesState;
  mapBounding: Map<string, BoundingConfiguration>;
  setMapBounding: (map: Map<string, BoundingConfiguration>) => void;
  config: Config;
  blueprint: Map<string, BoundingConfiguration[]>;
  setBlueprint: (map: Map<string, BoundingConfiguration[]>) => void;
}

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

const BoxContext = createContext<BoxContextValue | undefined>(undefined);

export function BoxProvider(props: { children: React.ReactNode }) {
  const flow = useProject();
  const { config } = useProject();
  const [mapBounding, setMapBounding] = useState(
    new Map<string, BoundingConfiguration>()
  );
  const [focusPoint, setFocusPoint] = useState("");
  const [focusNode, setFocusNode] = useState<AppNode | undefined>(undefined);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const [blueprint, setBlueprint] = useState(
    new Map<string, BoundingConfiguration>()
  );

  useEffect(() => {
    if (flow) {
      setNodes(flow.nodesState.nodes);
      setEdges(flow.edgesState.edges);
    }
    setFocusNode(undefined);
  }, [flow, setNodes, setEdges]);

  return (
    <BoxContext.Provider
      value={{
        focusNode,
        setFocusNode,
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
        focusPoint,
        setFocusPoint,
        mapBounding,
        setMapBounding,
        config,
        blueprint,
        setBlueprint,
      }}
    >
      {props.children}
    </BoxContext.Provider>
  );
}

export function useBox() {
  const context = React.useContext(BoxContext);
  if (context === undefined) {
    throw new Error("useExecution must be used within a ExecutionProvider");
  }
  return context;
}
