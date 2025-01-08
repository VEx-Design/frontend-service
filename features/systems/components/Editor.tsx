import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import StarterNode from "./nodes/StarterNode";
import TerminalNode from "./nodes/TerminalNode";

const rfStyle = {
  backgroundColor: "#FDFDFD",
};

const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "starter",
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
  {
    id: "node-2",
    type: "terminal",
    position: { x: 600, y: 0 },
    data: { value: 123 },
  },
];

const nodeTypes = { starter: StarterNode, terminal: TerminalNode };

export default function Editor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        style={rfStyle}
        fitView
        fitViewOptions={{ maxZoom: 0.8 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
