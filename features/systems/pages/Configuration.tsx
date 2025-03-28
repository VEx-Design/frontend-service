"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import React from "react";
import TypeLister from "../components/Configuration/type/TypeLister";
import ParamLister from "../components/Configuration/parameter/ParamLister";
import ConfigTerminal from "../components/Configuration/ConfigConsole";
import ConfigFreeS from "../components/Configuration/ConfigFreeS";
import { ConfigFreeSProvider } from "../contexts/Configuration/ConfigFreeSContext";
import { ConfigInterfaceProvider } from "../contexts/Configuration/ConfigInterfaceContext";
import { useConfigType } from "../contexts/Configuration/ConfigTypeContext";

export default function Configuration() {
  const { currentConfigFreeS } = useConfigType();

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
