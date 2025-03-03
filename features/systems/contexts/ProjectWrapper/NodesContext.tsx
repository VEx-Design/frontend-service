"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { NodeChange, useNodesState } from "@xyflow/react";
import { AppNode } from "../../libs/ClassNode/types/AppNode";

interface NodesState {
  nodes: AppNode[];
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
}

const NodesContext = createContext<NodesState | undefined>(undefined);

export const NodesProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);

  return (
    <NodesContext.Provider value={{ nodes, setNodes, onNodesChange }}>
      {children}
    </NodesContext.Provider>
  );
};

export const useNodes = () => {
  const context = useContext(NodesContext);
  if (!context) {
    throw new Error("useNodes must be used within a NodesProvider");
  }
  return context;
};
