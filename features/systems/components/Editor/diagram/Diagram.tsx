import React, { useCallback, useMemo } from "react";
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

  // Memoized nodes and edges for performance
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);

  const onNodeDragStart = useCallback(() => {
    document.body.style.cursor = "grabbing";
  }, []);

  const onNodeDragStop = useCallback(() => {
    document.body.style.cursor = "default";
  }, []);

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
      edgeAction.createEdge(connection);
    },
    [edgeAction]
  );

  const handleSelectionChange = useCallback(
    (changes: { edges: Edge[] }) => {
      if (changes.edges.length > 0) {
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

  const handleBackgroundClick = useCallback(() => {
    setFocusNode(undefined);
  }, [setFocusNode]);

  const fitViewOptions = useMemo(
    () => ({ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 }),
    []
  );

  return (
    <ReactFlow
      nodes={memoizedNodes}
      edges={memoizedEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={rfStyle}
      fitView
      fitViewOptions={fitViewOptions}
      onPaneClick={handleBackgroundClick}
      onSelectionChange={handleSelectionChange}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      deleteKeyCode={[]}
      panOnDrag
    >
      <Controls />
    </ReactFlow>
  );
}
