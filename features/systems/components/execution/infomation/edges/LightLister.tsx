import { useExecution } from "@/features/systems/contexts/ExecutionContext";
import React from "react";
import LightBox from "./LightBox";

export default function LightLister() {
  const { focusEdge } = useExecution();
  return (
    <div>
      <div className="p-2 border-b text-H4 font-bold">Lights</div>
      <div className="flex flex-col p-2 gap-2">
        {focusEdge?.data?.lights?.map((light, index) => (
          <LightBox key={light.id} light={light} index={index} />
        ))}
      </div>
    </div>
  );
}
