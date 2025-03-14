import React, { createContext, useState, useEffect } from "react";
import { AppEdge, EdgeData } from "../../libs/ClassEdge/types/AppEdge";
import { AppNode, NodeData } from "../../libs/ClassNode/types/AppNode";
import {
  useEdgesState,
  useNodesState,
  NodeChange,
  EdgeChange,
  ReactFlowProvider,
} from "@xyflow/react";
import { useProject } from "../ProjectContext";

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
  edgeAction: EdgeAction;
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

interface EdgeAction {
  setFocusDistance: (focusDistance: number) => void;
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
      if (focusNode) {
        const foundNode = executedFlow.nodes.find(
          (node) => node.id === focusNode.id
        );
        if (foundNode) {
          setFocusNode({
            id: foundNode.id,
            type: foundNode.type || "",
            data: foundNode.data.data,
          });
        }
      }
      if (focusEdge) {
        const foundEdge = executedFlow.edges.find(
          (edge) => edge.id === focusEdge.id
        );
        if (foundEdge) {
          setFocusEdge({
            id: foundEdge.id,
            type: foundEdge.type || "",
            data: foundEdge.data.data,
          });
        }
      }
    }
    console.log("Executed Flow", executedFlow);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executedFlow, setEdges, setNodes]);

  const edgeAction: EdgeAction = {
    setFocusDistance: (focusDistance: number) => {
      if (focusEdge) {
        focusEdge.data.focusDistance = focusDistance;
        setEdges(
          edges.map((edge) => {
            if (edge.id === focusEdge.id) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  focusDistance,
                },
              };
            }
            return edge;
          })
        );
      }
    },
  };

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
        edgeAction,
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
