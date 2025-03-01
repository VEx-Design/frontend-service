import React, { useCallback } from "react";
import {
  ReactFlow,
  Controls,
  useReactFlow,
  Edge,
  Connection,
} from "@xyflow/react";
import StarterNode from "./nodes/StarterNode";
import TerminalNode from "./nodes/TerminalNode";
import ObjectNode from "./nodes/ObjectNode";
import LightEdge from "./edges/LightEdge";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { useEditor } from "@/features/systems/contexts/EditorContext";

const rfStyle = {
  backgroundColor: "#FAFAFA",
};

const nodeTypes = {
  starter: StarterNode,
  terminal: TerminalNode,
  ObjectNode: ObjectNode,
};

const edgeTypes = {
  default: LightEdge,
};

export default function Diagram() {
  const { screenToFlowPosition } = useReactFlow();
  const { nodesState, edgesState, configAction } = useProject();
  const { nodes, onNodesChange } = nodesState;
  const { edges, onEdgesChange } = edgesState;

  const { nodeAction, edgeAction, setFocusNode, setFocusEdge } = useEditor();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const id = event.dataTransfer.getData("application/reactflow");
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      nodeAction.createNode("object", position, configAction.getType(id));
    },
    [configAction, nodeAction, screenToFlowPosition]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log(connection);
      edgeAction.createEdge(connection);
    },
    [edgeAction]
  );

  const handleSelectionChange = useCallback(
    (changes: { edges: Edge[] }) => {
      if (changes.edges && changes.edges.length > 0) {
        setFocusNode(undefined);
        setFocusEdge({
          id: changes.edges[0].id,
          type: "default",
          data: changes.edges[0].data?.data ?? {},
        });
      } else {
        setFocusEdge(undefined);
      }
    },
    [setFocusEdge, setFocusNode]
  );

  const handleBackgroundClick = () => {
    setFocusNode(undefined);
  };

  return (
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
      fitViewOptions={{ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 }}
      onPaneClick={handleBackgroundClick}
      onSelectionChange={handleSelectionChange}
      deleteKeyCode={[]}
    >
      <Controls />
    </ReactFlow>
  );
}
