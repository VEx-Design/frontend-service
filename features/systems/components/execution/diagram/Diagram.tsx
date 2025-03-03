import React, { useCallback } from "react";
import { ReactFlow, Controls, Edge } from "@xyflow/react";
import StarterNode from "./nodes/StarterNode";
import TerminalNode from "./nodes/TerminalNode";
import ObjectNode from "./nodes/ObjectNode";
import LightEdge from "./edges/LightEdge";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";

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
  const { nodesState, edgesState } = useExecution();
  const { nodes, onNodesChange } = nodesState;
  const { edges, onEdgesChange } = edgesState;

  const { setFocusNode, setFocusEdge } = useExecution();

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
      style={rfStyle}
      fitView
      fitViewOptions={{ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 }}
      onPaneClick={handleBackgroundClick}
      onSelectionChange={handleSelectionChange}
      deleteKeyCode={[]}
    >
      <Controls position="top-right" />
    </ReactFlow>
  );
}
