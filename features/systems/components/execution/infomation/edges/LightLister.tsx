import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import React from "react";
import LightBox from "./LightBox";

export default function LightLister() {
  const { focusEdge } = useExecution();

  return (
    <div>
      <div className="px-2 py-3 border-b text-H5 font-bold text-C1 text-center">
        Lights
      </div>
      <div className="flex flex-col p-2 gap-2">
        {focusEdge?.data?.lights?.length ?? 0 > 0 ? (
          focusEdge?.data?.lights?.map((light, index) => (
            <LightBox key={light.id} light={light} index={index} />
          ))
        ) : (
          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm italic">
            {"No lights available"}
          </div>
        )}
      </div>
    </div>
  );
}
