import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MainInfo from "./information/MainInfo";
import FormulaLister from "./interface/FormulaLister";
import InterfaceLister from "./interface/InterfaceLister";
import { ReactFlowProvider } from "@xyflow/react";
import { useConfig } from "../../contexts/ConfigContext";
import { useConfigInterface } from "../../contexts/ConfigInterfaceContext";

/**  */
export default function ConfigTerminal() {
  const { currentType } = useConfig();
  const { currentInterface } = useConfigInterface();

  return currentType ? (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={35} minSize={35} maxSize={35}>
        <ReactFlowProvider>
          <MainInfo />
        </ReactFlowProvider>
      </ResizablePanel>
      <ResizableHandle />

      <ResizablePanel defaultSize={65}>
        {currentInterface ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70}>
              <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-r-1 border-editbar-border py-4 px-6">
                <FormulaLister />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={20} maxSize={35}>
              <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3">
                <InterfaceLister />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3">
            <InterfaceLister />
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  ) : (
    <div className="flex justify-center items-center h-full text-gray-500 text-sm">
      Please select type before config
    </div>
  );
}
