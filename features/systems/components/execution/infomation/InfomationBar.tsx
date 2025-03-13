import React from "react";
import EdgeInfomation from "./edges/EdgeInfomation";
import { LightInfoProvider } from "@/features/systems/contexts/Execution/LightInfoContext";
import NodeInfomation from "./nodes/NodeInfomation";
import { NodeInfoProvider } from "@/features/systems/contexts/Execution/NodeInfoContext";
import StarterInfomation from "./nodes/starter/StarterInformation";
import TerminalInfomation from "./nodes/terminal/TerminalInfomation";

export default function InfomationBar() {
  return (
    <div className="flex flex-col w-full h-full">
      <LightInfoProvider>
        <EdgeInfomation />
        <StarterInfomation />
        <TerminalInfomation />
      </LightInfoProvider>
      <NodeInfoProvider>
        <NodeInfomation />
      </NodeInfoProvider>
    </div>
  );
}
