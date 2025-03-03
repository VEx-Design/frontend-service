"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { EdgeChange, useEdgesState } from "@xyflow/react";
import { AppEdge } from "../../libs/ClassEdge/types/AppEdge";

interface EdgesState {
  edges: AppEdge[];
  setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>;
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => void;
}

const EdgesContext = createContext<EdgesState | undefined>(undefined);

export const EdgesProvider = ({ children }: { children: ReactNode }) => {
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  return (
    <EdgesContext.Provider value={{ edges, setEdges, onEdgesChange }}>
      {children}
    </EdgesContext.Provider>
  );
};

export const useEdges = () => {
  const context = useContext(EdgesContext);
  if (!context) {
    throw new Error("useEdges must be used within an EdgesProvider");
  }
  return context;
};
