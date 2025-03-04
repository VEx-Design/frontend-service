import {
  EdgeChange,
  NodeChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { AppNode } from "../libs/ClassNode/types/AppNode";
import { AppEdge } from "../libs/ClassEdge/types/AppEdge";
import { createContext, useEffect, useState } from "react";
import React from "react";
import { Config } from "../libs/ClassConfig/types/Config";
import { useConfig } from "./ProjectWrapper/ConfigContext";
import { useNodes } from "./ProjectWrapper/NodesContext";
import { useEdges } from "./ProjectWrapper/EdgesContext";

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
  const nodesState = useNodes();
  const edgesState = useEdges();
  const { config } = useConfig();
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
  }, [nodesState.nodes, edgesState.edges, setNodes, setEdges]);

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
