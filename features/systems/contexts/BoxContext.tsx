import { EdgeChange, NodeChange, useEdgesState, useNodesState } from "@xyflow/react";
import { AppNode, NodeData } from "../libs/ClassNode/types/AppNode";
import { AppEdge, EdgeData } from "../libs/ClassEdge/types/AppEdge";
import { useProject } from "./ProjectContext";
import { createContext, use, useEffect, useState } from "react";
import React from "react";
import { BoxConfig, BoxInformation } from "../libs/ClassBox/types/BoxConfig";

interface BoxContextValue {
  focusNode: AppNode | undefined;
  setFocusNode: (node: AppNode | undefined) => void;
  nodesState: NodesState;
  edgesState: EdgesState;
  boxInformation: BoxInformation;
  map : Map<string, BoxConfig>;
  setMap: (map: Map<string, BoxConfig>) => void;
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

export function BoxProvider (props: { children: React.ReactNode }) {
    const flow = useProject();
    const [map, setMap] = useState(new Map<string, BoxConfig>());
    const [focusNode, setFocusNode] = useState<AppNode | undefined>(undefined);
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
    const boxInformation = new BoxInformation();

    useEffect(() => {
      if(flow){
        setNodes(flow.nodesState.nodes);
        setEdges(flow.edgesState.edges);
      }
      setFocusNode(undefined);
    }, [flow, setNodes, setEdges])

  return (
    <BoxContext.Provider value={{
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
      boxInformation,
      map,
      setMap
    }}>
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