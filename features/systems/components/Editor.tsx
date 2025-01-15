"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import FlowEditor from "@/features/systems/components/Editor/FlowEditor";
import { NodeData } from "@/features/systems/types/object";
import { createContext, useCallback, useEffect, useState } from "react";
import SelectionSide from "./Editor/SelectionSide";
import { useReactFlow } from "@xyflow/react";
import getTypes, { TypesResponse } from "../actions/getTypes";
import InspectorBar from "./Editor/InspectorBar";

type FocusNode = {
  id: string;
  data: NodeData;
};

interface EditorContextValue {
  focusNode: FocusNode | undefined;
  setFocusNode: (node: FocusNode) => void;
  updateNodeId: (id: string, data: NodeData) => void;
}

export const EditorContext = createContext<EditorContextValue | undefined>(
  undefined
);

export default function Editor() {
  const [types, setTypes] = useState<TypesResponse[] | undefined>(undefined);
  const [focusNode, setFocusNode] = useState<FocusNode | undefined>(undefined);

  const { setNodes } = useReactFlow();

  const updateNodeId = useCallback(
    (id: string, data: NodeData) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, data: data } }
            : node
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    updateNodeId(focusNode?.id || "", focusNode?.data || {});
  }, [focusNode, updateNodeId]);

  async function fetchTypes() {
    try {
      const data = await getTypes();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <EditorContext.Provider value={{ focusNode, setFocusNode, updateNodeId }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <SelectionSide />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} minSize={15}>
          <FlowEditor types={types} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
          <InspectorBar />
        </ResizablePanel>
      </ResizablePanelGroup>
    </EditorContext.Provider>
  );
}
