import React, { createContext, useState, useEffect } from "react";
import { AppEdge, EdgeData } from "../libs/ClassEdge/types/AppEdge";
import { AppNode, NodeData } from "../libs/ClassNode/types/AppNode";
import {
  useEdgesState,
  useNodesState,
  NodeChange,
  EdgeChange,
  ReactFlowProvider,
} from "@xyflow/react";
import { useProject } from "./ProjectContext";

type FocusNode = {
  id: string;
  type: string;
  data: NodeData;
};

type FocusEdge = {
  id: string;
  type: string;
  data: EdgeData;
};

interface ExecutionContextValue {
  focusNode: FocusNode | undefined;
  setFocusNode: (node: FocusNode | undefined) => void;
  focusEdge: FocusEdge | undefined;
  setFocusEdge: (edge: FocusEdge | undefined) => void;
  nodesState: NodesState;
  edgesState: EdgesState;
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

const ExecutionContext = createContext<ExecutionContextValue | undefined>(
  undefined
);

export function ExecutionProvider(props: { children: React.ReactNode }) {
  const { executedFlow } = useProject();
  const [focusNode, setFocusNode] = useState<FocusNode | undefined>(undefined);
  const [focusEdge, setFocusEdge] = useState<FocusEdge | undefined>(undefined);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  useEffect(() => {
    if (executedFlow) {
      setNodes(executedFlow.nodes);
      setEdges(executedFlow.edges);
    }
  }, [executedFlow, setEdges, setNodes]);

  return (
    <ExecutionContext.Provider
      value={{
        focusNode,
        setFocusNode,
        focusEdge,
        setFocusEdge,
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
      }}
    >
      <ReactFlowProvider>{props.children}</ReactFlowProvider>
    </ExecutionContext.Provider>
  );
}

export function useExecution() {
  const context = React.useContext(ExecutionContext);
  if (context === undefined) {
    throw new Error("useExecution must be used within a ExecutionProvider");
  }
  return context;
}
