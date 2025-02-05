import { ReactFlow, useNodesState, useReactFlow } from "@xyflow/react";
import React, { useEffect, useContext } from "react";
import { AppNode } from "../../../types/appNode";
import { CreateObjectConfigNode } from "../../../libs/createFlowNode";
import Input from "../_input/Input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PropertiesLister from "./PropertiesLister";
import ObjectConfigNode from "./ObjectConfigNode";
import { ProjectContext } from "@/features/systems/contexts/ProjectContext";

const rfStyle = {
  backgroundColor: "#FAFAFA",
};

const nodeTypes = {
  ObjectConfigNode: ObjectConfigNode,
};

export default function MainInfo() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("MainInfo must be used within a ProjectContext");
  }

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (context.currentType) {
      const newNode = CreateObjectConfigNode(context.currentType);
      setNodes([newNode]);

      setTimeout(() => {
        fitView({ maxZoom: 0.9, duration: 300 });
      }, 0);
    }
  }, [setNodes, context, fitView]);

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
              <Input label="Name" value={context.currentType?.name || ""} />
              <Input
                label="Display Name"
                value={context.currentType?.name || ""}
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
