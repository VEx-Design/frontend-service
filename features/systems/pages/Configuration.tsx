"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import React from "react";
import { ConfigInterfaceProvider } from "../contexts/ConfigInterfaceContext";
import TypeLister from "../components/Configuration/type/TypeLister";
import ParamLister from "../components/Configuration/parameter/ParamLister";
import ConfigTerminal from "../components/Configuration/ConfigConsole";
import { useConfig } from "../contexts/ConfigContext";
import ConfigFreeS from "../components/Configuration/ConfigFreeS";
import { ConfigFreeSProvider } from "../contexts/ConfigFreeSContext";

export default function Configuration() {
  const { currentConfigFreeS } = useConfig();

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60} minSize={15}>
            <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3">
              <TypeLister />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40} minSize={15}>
            <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3">
              <ParamLister />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80} minSize={15}>
        {currentConfigFreeS ? (
          <ConfigFreeSProvider>
            <ConfigFreeS />
          </ConfigFreeSProvider>
        ) : (
          <ConfigInterfaceProvider>
            <ConfigTerminal />
          </ConfigInterfaceProvider>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
