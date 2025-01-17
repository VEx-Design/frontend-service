import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ReactFlow,
  Controls,
  Background,
  Edge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Connection,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import StarterNode from "../nodes/StarterNode";
import TerminalNode from "../nodes/TerminalNode";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AppNode } from "../../types/appNode";
import {
  CreateObjectNode,
  CreateStarterNode,
  CreateTerminalNode,
} from "../../libs/createFlowNode";
import { TypesResponse } from "../../actions/getTypes";
import { getTypeById } from "../../libs/getTypeDetail";
import ObjectNode from "../nodes/ObjectNode";
import { ProjectContext } from "../Project";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import saveFlow from "../../actions/saveFlow";
import { EditorContext } from "../Editor";
import LightEdge from "../edges/LightEdge";
import { AppEdge } from "../../types/appEdge";
import { ParamsResponse } from "../../actions/getParameter";

const rfStyle = {
  backgroundColor: "#FAFAFA",
};

interface Props {
  types: TypesResponse[] | undefined;
  params: ParamsResponse[] | undefined;
}

const nodeTypes = {
  starter: StarterNode,
  terminal: TerminalNode,
  ObjectNode: ObjectNode,
};

const edgeTypes = {
  default: LightEdge,
};

export default function FlowEditor(props: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const { screenToFlowPosition, updateNodeData, setViewport } = useReactFlow();
  const [connectedHandles, setConnectedHandles] = useState<Set<string>>(
    new Set()
  );

  const projectContext = useContext(ProjectContext);
  if (!projectContext) {
    throw new Error("ProjectContext must be used within an ProjectProvider");
  }
  const { projId, flowStr, setOnSave, setSavePending } = projectContext;

  const editorContext = useContext(EditorContext);
  if (!editorContext) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }
  const { setFocusNode, setFocusEdge } = editorContext;

  const handleBackgroundClick = () => {
    setFocusNode(undefined);
  };

  useEffect(() => {
    try {
      const flow = JSON.parse(flowStr);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.error("Failed to parse flow string:", error);
    }
  }, [flowStr, setEdges, setNodes, setViewport]);

  useEffect(() => {
    try {
      const flow = JSON.parse(flowStr);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.error("Failed to parse flow string:", error);
    }
  }, [flowStr, setEdges, setNodes, setViewport]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      projId,
      flow,
    }: {
      projId: string;
      flow: { nodes: AppNode[]; edges: AppEdge[] };
    }) => saveFlow(projId, flow),
    onSuccess: () => {
      toast.success("Project saved", { id: "save-project" });
    },
    onError: () => {
      toast.error("Failed to save project", { id: "save-project" });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Saving project...", { id: "save-project" });
    mutate({ projId, flow: { nodes, edges } });
  }, [mutate, edges, nodes, projId]);

  useEffect(() => {
    setOnSave(() => () => onSubmit());
    setSavePending(isPending);
  }, [isPending, setSavePending, onSubmit, setOnSave]);

  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleAddNode = (type: "starter" | "terminal") => {
    if (contextMenuPosition) {
      const position = screenToFlowPosition(contextMenuPosition);
      let newNode: AppNode;

      if (type === "starter") {
        newNode = CreateStarterNode(position);
      } else if (type === "terminal") {
        newNode = CreateTerminalNode(position);
      }

      setNodes((prevNodes) => [...prevNodes, newNode]);
      setContextMenuPosition(null);
    }
  };

  const nodesMap = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, AppNode>);
  }, [nodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Validate the connection to ensure targetHandle is available
      if (!connection.targetHandle) return;

      // if (
      //   connectedHandles.has(`${connection.targetHandle}-${connection.target}`)
      // ) {
      //   alert("This handle is already connected!");
      //   return; // Prevent new connections to this handle
      // }

      // Add the new edge with animation and unique ID
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            id: crypto.randomUUID(), // Unique ID for each connection
            data: {
              data: {
                light: {
                  distance: "25",
                  focusDistance: 0,
                  locked: false,
                },
              },
            },
          },
          eds
        )
      );

      // Retrieve the target node and ensure it exists
      const node = nodesMap[connection.target];
      if (!node) return;

      // Ensure nodeInputs is always an object and handle missing inputs
      const nodeInputs = node.data.inputs ?? {};

      // Update the node data with the new input for the targetHandle
      updateNodeData(node.id, {
        inputs: {
          ...(typeof nodeInputs === "object" ? nodeInputs : {}),
          [connection.targetHandle]: "", // Clear the input value for the targetHandle
        },
      });

      setConnectedHandles(
        (prev) =>
          new Set(prev.add(`${connection.targetHandle}-${connection.target}`))
      );
    },
    [setEdges, nodesMap, updateNodeData, connectedHandles]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const id = event.dataTransfer.getData("application/reactflow");

      const type = getTypeById(id, props.types ?? []);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (type) {
        const newNode = CreateObjectNode(type, position);
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes, screenToFlowPosition, props.types]
  );

  const handleSelectionChange = useCallback(
    (changes: { edges: Edge[] }) => {
      if (changes.edges && changes.edges.length > 0) {
        setFocusNode(undefined);
        setFocusEdge({
          id: changes.edges[0].id,
          type: "default",
          data: changes.edges[0].data?.data ?? {},
          source: changes.edges[0].source,
          sourceHandle: changes.edges[0].sourceHandle ?? "",
        });
      } else {
        setFocusEdge(undefined);
      }
    },
    [setFocusEdge, setFocusNode]
  );

  return (
    <div className="h-full" onContextMenu={handleContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={rfStyle}
            fitView
            fitViewOptions={{ maxZoom: 0.8 }}
            onPaneClick={handleBackgroundClick}
            onSelectionChange={handleSelectionChange}
            deleteKeyCode={[]}
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={2} />
          </ReactFlow>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => handleAddNode("starter")} inset>
            Add Starter node
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAddNode("terminal")} inset>
            Add Terminal node
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
