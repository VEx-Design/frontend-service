import React, { createContext, useState } from "react";
import { EdgeData } from "../libs/ClassEdge/types/AppEdge";
import { AppNode, NodeData } from "../libs/ClassNode/types/AppNode";
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

export type Coordinate = {
  x: number;
  y: number;
};

interface EditorContextValue {
  focusNode: FocusNode | undefined;
  setFocusNode: (node: FocusNode | undefined) => void;
  focusEdge: FocusEdge | undefined;
  setFocusEdge: (edge: FocusEdge | undefined) => void;
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

export function EditorProvider(props: { children: React.ReactNode }) {
  const [focusNode, setFocusNode] = useState<FocusNode | undefined>(undefined);
  const [focusEdge, setFocusEdge] = useState<FocusEdge | undefined>(undefined);
  const [contextMenuPosition, setContextMenuPosition] =
    useState<Coordinate | null>(null);

  const { configAction, nodesState, edgesState } = useProject();

  const updateFocusNodeData = (newData: NodeData) => {
    setFocusNode((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: newData,
      };
    });
  };

  const nodeAction: NodeAction = {
    createNode: (type: string, position: Coordinate, objectType?: Type) => {
      let newNode: AppNode | null = null;
      if (type === "starter") {
        newNode = CreateStarterNode(position);
      } else if (type === "terminal") {
        newNode = CreateTerminalNode(position);
      } else if (type === "object") {
        if (objectType) {
          newNode = CreateObjectNode(objectType, position);
        } else {
          throw new Error("objectType is required to create an object node");
        }
      }
      if (newNode) {
        nodesState.setNodes([...nodesState.nodes, newNode]);
      }
    },
    setInitial: (lightId: string, paramId: string, value: number) => {
      if (focusNode?.data) {
        const newFocusNode = setInitial(
          focusNode.data,
          lightId,
          paramId,
          value
        );
        updateFocusNodeData(newFocusNode);
        configAction.editNode(focusNode.id, newFocusNode);
      }
    },
    setValue: (propId: string, value: number) => {
      if (focusNode?.data) {
        updateFocusNodeData(setValue(focusNode.data, propId, value));
        configAction.editNode(
          focusNode.id,
          setValue(focusNode.data, propId, value)
        );
      }
    },
    addInitialLight: () => {
      if (focusNode?.data) {
        const newFocusNode = addInitialLight(focusNode.data);
        updateFocusNodeData(newFocusNode);
        configAction.editNode(focusNode.id, newFocusNode);
      }
    },
  };

  const edgeAction: EdgeAction = {
    createEdge: (connection: Connection) => {
      const edge = CreateEdgeLight(connection);
      if (!edge) {
        console.error("Edge creation failed!");
        return;
      }

      const currentEdges = edgesState.edges;
      const isDuplicate = currentEdges.some(
        (e) =>
          (e.sourceHandle === connection.sourceHandle ||
            e.targetHandle === connection.targetHandle) &&
          e.source === connection.source &&
          e.target === connection.target
      );
      if (isDuplicate) {
        toast.warning("Interface Already Connected", {
          id: "add-edge",
          description: `Each interface can only have one connection.`,
        });
        return;
      }
      const isSelf = connection.source === connection.target;
      if (isSelf) {
        toast.warning("Self Connection", {
          id: "add-edge",
          description: `Cannot connect to itself.`,
        });
        return;
      }

      edgesState.setEdges([...currentEdges, edge]);
    },
  };

  return (
    <EditorContext.Provider
      value={{
        focusNode,
        setFocusNode,
        focusEdge,
        setFocusEdge,
        contextMenuPosition,
        setContextMenuPosition,
        nodeAction,
        edgeAction,
      }}
    >
      <ReactFlowProvider>{props.children}</ReactFlowProvider>
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
