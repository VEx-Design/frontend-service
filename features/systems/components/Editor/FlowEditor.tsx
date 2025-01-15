import React, { useCallback, useState } from "react";
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
  CreateStarterNode,
  CreateTerminalNode,
} from "../../libs/createFlowNode";

const rfStyle = {
  backgroundColor: "#FDFDFD",
};

const nodeTypes = { starter: StarterNode, terminal: TerminalNode };

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, updateNodeData } = useReactFlow();

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
            style={rfStyle}
            fitView
            fitViewOptions={{ maxZoom: 0.8 }}
          >
            <Controls />
            <Background />
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
