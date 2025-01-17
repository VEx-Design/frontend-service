"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import FlowEditor from "@/features/systems/components/Editor/FlowEditor";
import { NodeData } from "@/features/systems/types/object";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SelectionSide from "./Editor/SelectionSide";
import { useReactFlow } from "@xyflow/react";
import getTypes, { TypesResponse } from "../actions/getTypes";
import InspectorBar from "./Editor/InspectorBar";
import { EdgeData } from "../types/light";
import { ParamsResponse } from "../actions/getParameter";
import { ProjectContext } from "./Project";
// import { ExprsResponse } from "../actions/getExpression";

type FocusNode = {
  id: string;
  type: string;
  data: NodeData;
};

type FocusEdge = {
  id: string;
  type: string;
  data: EdgeData;
  source: string;
  sourceHandle: string;
};

interface EditorContextValue {
  params: ParamsResponse[] | undefined;
  focusNode: FocusNode | undefined;
  setFocusNode: (node: FocusNode | undefined) => void;
  focusEdge: FocusEdge | undefined;
  setFocusEdge: (edge: FocusEdge | undefined) => void;
  updateNodeId: (id: string, data: NodeData) => void;
}

export const EditorContext = createContext<EditorContextValue | undefined>(
  undefined
);

export default function Editor() {
  const projectContext = useContext(ProjectContext);

  if (!projectContext) {
    throw new Error("ProjectContext must be used within an ProjectProvider");
  }

  const [types, setTypes] = useState<TypesResponse[] | undefined>(undefined);
  const [params, setParams] = useState<ParamsResponse[] | undefined>(undefined);
  // const [exprs, setExprs] = useState<ExprsResponse[] | undefined>(undefined);
  const [focusNode, setFocusNode] = useState<FocusNode | undefined>(undefined);
  const [focusEdge, setFocusEdge] = useState<FocusEdge | undefined>(undefined);

  const { setNodes, setEdges } = useReactFlow();

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

  const updateEdgeId = useCallback(
    (id: string, data: EdgeData) => {
      setEdges((prevEdges) =>
        prevEdges.map((edge) =>
          edge.id === id
            ? { ...edge, data: { ...edge.data, data: data } }
            : edge
        )
      );
    },
    [setEdges]
  );

  useEffect(() => {
    if (focusNode) updateNodeId(focusNode?.id || "", focusNode?.data || {});
    if (focusEdge) updateEdgeId(focusEdge?.id || "", focusEdge?.data || {});
  }, [focusNode, focusEdge, updateNodeId, updateEdgeId]);

  async function fetchTypes() {
    try {
      const data = await getTypes();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function fetchParams() {
    setParams([
      {
        id: "1",
        name: "beam radius",
        symbol: "r",
      },
      {
        id: "2",
        name: "beam angles",
        symbol: "θ",
      },
    ]);
  }

  // async function fetchExprs() {
  //   setParams([
  //     {
  //       id: "1",
  //       name: "beam radius",
  //       symbol: "r",
  //     },
  //     {
  //       id: "2",
  //       name: "beam angles",
  //       symbol: "θ",
  //     },
  //   ]);
  // }

  useEffect(() => {
    fetchTypes();
    fetchParams();
  }, []);

  return (
    <EditorContext.Provider
      value={{
        params,
        focusNode,
        setFocusNode,
        focusEdge,
        setFocusEdge,
        updateNodeId,
      }}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <SelectionSide />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} minSize={15}>
          <FlowEditor types={types} params={params} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
          <InspectorBar />
        </ResizablePanel>
      </ResizablePanelGroup>
    </EditorContext.Provider>
  );
}
