import { Controls, Edge, ReactFlow } from '@xyflow/react';
import React, { useCallback } from 'react';
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

export default function Diagram() {
  const { nodesState, edgesState } = useBox();
  const { nodes, onNodesChange } = nodesState;
  const { edges, onEdgesChange } = edgesState;

  const { setFocusNode} = useBox();

  const handleNodeClikc = useCallback((_: React.MouseEvent, node: AppNode) => {
    setFocusNode(node);
  }, [setFocusNode]);

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
      onNodeClick={handleNodeClikc}
      style={rfStyle}
      fitView= {true}
      deleteKeyCode={[]}
      nodesDraggable={false}
      edgesFocusable={false}
    >
      <Controls />
    </ReactFlow>
  );
}
