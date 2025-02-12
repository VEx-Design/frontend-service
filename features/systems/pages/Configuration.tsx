"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TypeLister from "../components/configuration/type/TypeLister";
import ParamLister from "../components/configuration/parameter/ParamLister";
import ConfigTerminal from "../components/configuration/ConfigConsole";
import React from "react";
import { ConfigInterfaceProvider } from "../contexts/ConfigInterfaceContext";

export default function Configuration() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} minSize={15}>
            <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3">
              <TypeLister />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={15}>
            <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3">
              <ParamLister />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80} minSize={15}>
        <ConfigInterfaceProvider>
          <ConfigTerminal />
        </ConfigInterfaceProvider>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
