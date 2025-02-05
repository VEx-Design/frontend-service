import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactFlowProvider } from "@xyflow/react";
import { Interface } from "../../types/config";
import MainInfo from "./information/MainInfo";
import FormulaLister from "./terminal/FormulaLister";
import InterfaceLister from "./terminal/InterfaceLister";
import { ProjectContext } from "../../contexts/ProjectContext";
import { ConfigContext } from "../../contexts/ConfigConsoleContext";

/**  */
export default function ConfigTerminal() {
  const context = React.useContext(ProjectContext);

  if (!context) {
    throw new Error("ConfigTerminal must be used within a ProjectContext");
  }

  const [currentInterface, setCurrentInterface] = useState<
    Interface | undefined
  >(undefined);

  useEffect(() => {
    if (context.currentType) {
      setCurrentInterface(context.currentType.interface[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.currentType?.id]);

  if (!context.currentType) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 text-sm">
        Please select type before config
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{ currentInterface, setCurrentInterface }}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={35} minSize={35} maxSize={35}>
          <ReactFlowProvider>
            <MainInfo />
          </ReactFlowProvider>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65}>
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </ConfigContext.Provider>
  );
}
