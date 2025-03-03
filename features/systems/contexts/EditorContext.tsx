import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { EdgeData } from "../libs/ClassEdge/types/AppEdge";
import { NodeData } from "../libs/ClassNode/types/AppNode";
import {
  CreateObjectNode,
  CreateStarterNode,
  CreateTerminalNode,
} from "../libs/ClassNode/createFlowNode";
import { useProject } from "./ProjectContext";
import { Connection, ReactFlowProvider } from "@xyflow/react";
import { Type } from "../libs/ClassType/types/Type";
import { CreateEdgeLight } from "../libs/ClassEdge/createFlowEdge";
import setInitial from "../libs/ClassNode/setInitial";
import setValue from "../libs/ClassObject/setValue";
import addInitialLight from "../libs/ClassNode/addInitialLight";
import { toast } from "sonner";

interface Coordinate {
  x: number;
  y: number;
}

interface FocusNode {
  id: string;
  type: string;
  data: NodeData;
}

interface FocusEdge {
  id: string;
  type: string;
  data: EdgeData;
}

interface EditorContextValue {
  focusNode?: FocusNode;
  setFocusNode: (node?: FocusNode) => void;
  focusEdge?: FocusEdge;
  setFocusEdge: (edge?: FocusEdge) => void;
  contextMenuPosition: Coordinate | null;
  setContextMenuPosition: (position: Coordinate | null) => void;
  nodeAction: NodeAction;
  edgeAction: EdgeAction;
}

interface NodeAction {
  createNode: (type: string, position: Coordinate, objectType?: Type) => void;
  setInitial: (lightId: string, paramId: string, value: number) => void;
  setValue: (propId: string, value: number) => void;
  addInitialLight: () => void;
}

interface EdgeAction {
  createEdge: (connection: Connection) => void;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [focusNode, setFocusNode] = useState<FocusNode | undefined>();
  const [focusEdge, setFocusEdge] = useState<FocusEdge | undefined>();
  const [contextMenuPosition, setContextMenuPosition] =
    useState<Coordinate | null>(null);

  const { configAction, nodesState, edgesState } = useProject();

  const updateFocusNodeData = useCallback((newData: NodeData) => {
    setFocusNode((prev) => (prev ? { ...prev, data: newData } : prev));
  }, []);

  const nodeAction = useMemo(
    () => ({
      createNode: (type: string, position: Coordinate, objectType?: Type) => {
        const newNode =
          type === "starter"
            ? CreateStarterNode(position)
            : type === "terminal"
            ? CreateTerminalNode(position)
            : type === "object" && objectType
            ? CreateObjectNode(objectType, position)
            : null;

        if (newNode) nodesState.setNodes([...nodesState.nodes, newNode]);
      },
      setInitial: (lightId: string, paramId: string, value: number) => {
        if (focusNode?.data) {
          const updatedData = setInitial(
            focusNode.data,
            lightId,
            paramId,
            value
          );
          updateFocusNodeData(updatedData);
          configAction.editNode(focusNode.id, updatedData);
        }
      },
      setValue: (propId: string, value: number) => {
        if (focusNode?.data) {
          const updatedData = setValue(focusNode.data, propId, value);
          updateFocusNodeData(updatedData);
          configAction.editNode(focusNode.id, updatedData);
        }
      },
      addInitialLight: () => {
        if (focusNode?.data) {
          const updatedData = addInitialLight(focusNode.data);
          updateFocusNodeData(updatedData);
          configAction.editNode(focusNode.id, updatedData);
        }
      },
    }),
    [
      nodesState,
      focusNode?.data,
      focusNode?.id,
      updateFocusNodeData,
      configAction,
    ]
  );

  const edgeAction = useMemo(
    () => ({
      createEdge: (connection: Connection) => {
        const edge = CreateEdgeLight(connection);
        if (!edge) return console.error("Edge creation failed!");

        const isDuplicate = edgesState.edges.some(
          (e) =>
            (e.sourceHandle === connection.sourceHandle ||
              e.targetHandle === connection.targetHandle) &&
            e.source === connection.source &&
            e.target === connection.target
        );
        if (isDuplicate) {
          return toast.warning("Interface Already Connected", {
            id: "add-edge",
            description: "Each interface can only have one connection.",
          });
        }

        if (connection.source === connection.target) {
          return toast.warning("Self Connection", {
            id: "add-edge",
            description: "Cannot connect to itself.",
          });
        }

        edgesState.setEdges([...edgesState.edges, edge]);
      },
    }),
    [edgesState]
  );

  const contextValue = useMemo(
    () => ({
      focusNode,
      setFocusNode,
      focusEdge,
      setFocusEdge,
      contextMenuPosition,
      setContextMenuPosition,
      nodeAction,
      edgeAction,
    }),
    [focusNode, focusEdge, contextMenuPosition, nodeAction, edgeAction]
  );

  return (
    <EditorContext.Provider value={contextValue}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context)
    throw new Error("useEditor must be used within an EditorProvider");
  return context;
}
