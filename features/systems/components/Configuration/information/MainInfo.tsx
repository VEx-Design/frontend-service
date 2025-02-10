import { ReactFlow, useNodesState, useReactFlow } from "@xyflow/react";
import React, { useEffect } from "react";
import Input from "../_input/Input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PropertiesLister from "./PropertiesLister";
import ObjectConfigNode from "./ObjectConfigNode";
import { useConfig } from "@/features/systems/contexts/ConfigContext";

// type
import { AppNode } from "@/features/systems/libs/ClassNode/types/AppNode";

const rfStyle = {
  backgroundColor: "#FAFAFA",
};

const nodeTypes = {
  ObjectConfigNode: ObjectConfigNode,
};

export default function MainInfo() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const { fitView } = useReactFlow();
  const { currentType } = useConfig();

  useEffect(() => {
    if (!currentType) return;
    const newNode = {
      id: crypto.randomUUID(),
      type: "ObjectConfigNode",
      data: {
        data: {
          object: {
            name: currentType.name,
            typeId: currentType.id,
            vars: [],
          },
        },
      },
      position: { x: 0, y: 0 },
    };
    setNodes([newNode]);

    setTimeout(() => {
      fitView({ maxZoom: 0.9, duration: 300 });
    }, 0);
  }, [setNodes, fitView, currentType]);

  return (
    <div className="h-full w-full p-6">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="flex flex-1 gap-6">
            <div className="h-[280px] w-[280px]">
              <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                style={rfStyle}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnScroll={false}
                panOnDrag={false}
                preventScrolling={false}
              />
            </div>
            <div className="flex flex-col flex-1 gap-2 pe-6">
              <Input
                label="Name"
                value={currentType?.name || ""}
                onChange={() => {}}
              />
              <Input
                label="Display Name"
                value={currentType?.name || ""}
                onChange={() => {}}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={40} maxSize={50}>
          <PropertiesLister />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
