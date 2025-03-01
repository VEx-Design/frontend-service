import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useExecution } from "@/features/systems/contexts/ExecutionContext";
import React from "react";
import LightLister from "./LightLister";
import BeamCrossSectional from "../BeamCrossSectional";
import PolarizationScene from "../PolarizationCanvas";

export default function EdgeInfomation() {
  const { focusEdge } = useExecution();
  const lights = focusEdge?.data?.lights;

  if (!lights) return null;
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={10} minSize={5} maxSize={15}>
        <LightLister />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={15} maxSize={85}>
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
            <div className="flex flex-1 items-center">
              <div className="flex flex-1 border-r justify-center items-center">
                <BeamCrossSectional rx={30} ry={20} />
              </div>
              <div className="flex flex-1">
                <PolarizationScene />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60} minSize={15} maxSize={85}>
            <div className="flex flex-1">ddd</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
