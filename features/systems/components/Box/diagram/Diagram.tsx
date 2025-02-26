import { Controls, ReactFlow, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import React, { useCallback, useEffect } from 'react';
import StarterNode from './nodes/StarterNode';
import TerminalNode from './nodes/TerminalNode';
import ObjectNode from './nodes/ObjectNode';
import LightEdge from './edges/LightEdge';
import { useBox } from '@/features/systems/contexts/BoxContext';
import { AppNode } from '@/features/systems/libs/ClassNode/types/AppNode';

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

function DiagramComponent() {
  const { nodesState, edgesState } = useBox();
  const { nodes, onNodesChange } = nodesState;
  const { edges, onEdgesChange } = edgesState;
  const { setFocusNode } = useBox();
  const { fitView } = useReactFlow();

  const handleNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setFocusNode(node);
  }, [setFocusNode]);

  const handleBackgroundClick = () => {
    setFocusNode(undefined);
  };

  useEffect(() => {
    fitView();
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      style={rfStyle}
      fitView={true}
      fitViewOptions={{ maxZoom: 0.8, minZoom: 0.005, padding: 0.25 }}
      deleteKeyCode={[]}
      nodesDraggable={false}
      edgesFocusable={false}
      onPaneClick={handleBackgroundClick}
    >
      <Controls />
    </ReactFlow>
  );
}

export default function Diagram() {
  return (
    <ReactFlowProvider>
      <DiagramComponent />
    </ReactFlowProvider>
  );
}