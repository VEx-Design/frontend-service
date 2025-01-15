import React, { useCallback, useContext, useEffect, useState } from "react";
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

const rfStyle = {
  backgroundColor: "#FAFAFA",
};

interface Props {
  types: TypesResponse[] | undefined;
}

const nodeTypes = {
  starter: StarterNode,
  terminal: TerminalNode,
  ObjectNode: ObjectNode,
};

export default function FlowEditor(props: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, updateNodeData, setViewport } = useReactFlow();

  const projectContext = useContext(ProjectContext);
  if (!projectContext) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }
  const { projId, flowStr, setOnSave, setSavePending } = projectContext;

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
      flow: { nodes: AppNode[]; edges: Edge[] };
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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      // Remove input value if is present on connection
      const node = nodes.find((nd) => nd.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...(typeof nodeInputs === "object" && nodeInputs !== null
            ? nodeInputs
            : {}),
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, nodes, updateNodeData]
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

  return (
    <div className="h-full" onContextMenu={handleContextMenu}>
      <ContextMenu>
        <ContextMenuTrigger>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={rfStyle}
            fitView
            fitViewOptions={{ maxZoom: 0.8 }}
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
