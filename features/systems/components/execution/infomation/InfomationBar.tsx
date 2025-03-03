import React from "react";
import EdgeInfomation from "./edges/EdgeInfomation";
import { LightInfoProvider } from "@/features/systems/contexts/Execution/LightInfoContext";

export default function InfomationBar() {
  return (
    <div className="flex flex-col w-full h-full">
      <LightInfoProvider>
        <EdgeInfomation />
      </LightInfoProvider>
    </div>
  );
}
