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
  config: Config;
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
  const {nodesState, edgesState} = useProject();
  const { config } = useProject();
  const [focusPoint, setFocusPoint] = useState("");
  const [focusNode, setFocusNode] = useState<AppNode | undefined>(undefined);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
 

  useEffect(() => {
    if (nodesState.nodes && edgesState.edges) {
      setNodes(nodesState.nodes);
      setEdges(edgesState.edges);
    }
    setFocusNode(undefined);
  }, [nodesState.nodes, edgesState.edges]);

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
        config,
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
