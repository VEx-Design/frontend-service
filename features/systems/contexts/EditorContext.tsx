import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { AppEdge, EdgeData } from "../libs/ClassEdge/types/AppEdge";
import { AppNode, NodeData } from "../libs/ClassNode/types/AppNode";
import {
  CreateObjectNode,
  CreateStarterNode,
  CreateTerminalNode,
} from "../libs/ClassNode/createFlowNode";
import { useProject } from "./ProjectContext";
import {
  Connection,
  EdgeChange,
  NodeChange,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Type } from "../libs/ClassType/types/Type";
import { CreateEdgeLight } from "../libs/ClassEdge/createFlowEdge";
import setInitial from "../libs/ClassNode/setInitial";
import setValue from "../libs/ClassObject/setValue";
import addInitialLight from "../libs/ClassNode/addInitialLight";
import { toast } from "sonner";
import { useNodes } from "./ProjectWrapper/NodesContext";
import { useEdges } from "./ProjectWrapper/EdgesContext";
import { isEqual } from "lodash";
import updatePathColor from "../libs/ClassNode/updatePathColor";

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
  nodesState: NodesState;
  edgesState: EdgesState;
  focusNode?: FocusNode;
  setFocusNode: (node?: FocusNode) => void;
  focusEdge?: FocusEdge;
  setFocusEdge: (edge?: FocusEdge) => void;
  contextMenuPosition: Coordinate | null;
  setContextMenuPosition: (position: Coordinate | null) => void;
  nodeAction: NodeAction;
  edgeAction: EdgeAction;
}

interface NodesState {
  nodes: AppNode[];
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
}

interface EdgesState {
  edges: AppEdge[];
  setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>;
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => void;
}

interface NodeAction {
  createNode: (type: string, position: Coordinate, objectType?: Type) => void;
  setInitial: (lightId: string, paramId: string, value: number) => void;
  setValue: (propId: string, value: number) => void;
  addInitialLight: () => void;
  updatePathColor: (lightId: string, color: string) => void;
  rotate: () => void;
}

interface EdgeAction {
  createEdge: (connection: Connection) => void;
  setDistance: (distance: number) => void;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const [focusNode, setFocusNode] = useState<FocusNode | undefined>();
  const [focusEdge, setFocusEdge] = useState<FocusEdge | undefined>();
  const [contextMenuPosition, setContextMenuPosition] =
    useState<Coordinate | null>(null);

  const { isTriggered, setIsTriggered, projectFlow } = useProject();
  const nodesState = useNodes();
  const edgesState = useEdges();

  useEffect(() => {
    try {
      const flow = JSON.parse(projectFlow);
      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    } catch (error) {
      console.error("Error parsing flow:", error);
    }
  }, [projectFlow, setEdges, setNodes]);

  useEffect(() => {
    if (isTriggered) {
      nodesState.setNodes(nodes);
      edgesState.setEdges(edges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriggered]);

  useEffect(() => {
    if (isEqual(nodesState.nodes, nodes) && isEqual(edgesState.edges, edges)) {
      setIsTriggered(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesState.nodes, edgesState.edges, isTriggered]);

  const updateFocusNodeData = useCallback((newData: NodeData) => {
    setFocusNode((prev) => (prev ? { ...prev, data: newData } : prev));
  }, []);

  const editNode = useCallback(
    (nodeId: string, data: NodeData) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, data } } : node
        )
      );
    },
    [setNodes]
  );

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

        if (newNode) setNodes([...nodes, newNode]);
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
          editNode(focusNode.id, updatedData);
        }
      },
      setValue: (propId: string, value: number) => {
        if (focusNode?.data) {
          const updatedData = setValue(focusNode.data, propId, value);
          updateFocusNodeData(updatedData);
          editNode(focusNode.id, updatedData);
        }
      },
      addInitialLight: () => {
        if (focusNode?.data) {
          const updatedData = addInitialLight(focusNode.data);
          updateFocusNodeData(updatedData);
          editNode(focusNode.id, updatedData);
        }
      },
      updatePathColor: (lightId: string, color: string) => {
        if (focusNode?.data) {
          const updatedData = updatePathColor(focusNode.data, lightId, color);
          updateFocusNodeData(updatedData);
          editNode(focusNode.id, updatedData);
        }
      },
      rotate: () => {
        if (focusNode?.data) {
          const updatedData = {
            ...focusNode.data,
            rotate: ((focusNode.data.rotate + 90) % 360) as 0 | 90 | 180 | 270,
          };
          updateFocusNodeData(updatedData);
          editNode(focusNode.id, updatedData);
        }
      },
    }),
    [
      setNodes,
      nodes,
      focusNode?.data,
      focusNode?.id,
      updateFocusNodeData,
      editNode,
    ]
  );

  useEffect(() => {
    if (focusNode?.data) {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          if (edge.source === focusNode.id || edge.target === focusNode.id) {
            const updatedEdge = {
              ...edge,
              animated: true,
              data: {
                ...edge.data,
                key: `${edge.id}-${Date.now()}`,
              },
            };
            return updatedEdge;
          }
          return edge;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNode?.data.rotate]);

  const edgeAction = useMemo(
    () => ({
      createEdge: (connection: Connection) => {
        const edge = CreateEdgeLight(connection);
        if (!edge) return console.error("Edge creation failed!");

        const isDuplicate = edges.some(
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

        setEdges([...edges, edge]);
      },
      setDistance: (distance: number) => {
        if (focusEdge && focusEdge.data) {
          focusEdge.data.distance = distance.toString();
        }
        if (focusEdge?.data) {
          setEdges((prevEdges) =>
            prevEdges.map((edge) =>
              edge.id === focusEdge.id
                ? { ...edge, data: { ...edge.data, distance } }
                : edge
            )
          );
        }
      },
    }),
    [edges, focusEdge, setEdges]
  );

  const contextValue = useMemo(
    () => ({
      nodesState: { nodes, setNodes, onNodesChange },
      edgesState: { edges, setEdges, onEdgesChange },
      focusNode,
      setFocusNode,
      focusEdge,
      setFocusEdge,
      contextMenuPosition,
      setContextMenuPosition,
      nodeAction,
      edgeAction,
    }),
    [
      nodes,
      setNodes,
      onNodesChange,
      edges,
      setEdges,
      onEdgesChange,
      focusNode,
      focusEdge,
      contextMenuPosition,
      nodeAction,
      edgeAction,
    ]
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
