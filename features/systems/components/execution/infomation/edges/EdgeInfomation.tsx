import { useExecution } from "@/features/systems/contexts/ExecutionContext";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import React from "react";

export default function EdgeInfomation() {
  const { focusEdge } = useExecution();
  const lights = focusEdge?.data?.lights;

  const { configAction } = useProject();

  if (!lights) return null;
  return (
    <div className="flex flex-col">
      {/* <p>{focusEdge?.id}</p> */}
      <div className="flex flex-col overflow-auto">
        {lights.map((light, index) => {
          return (
            <div key={index}>
              {light.params.map((param) => {
                const paramInfo = configAction.getParameter(param.paramId);
                return (
                  <div key={param.paramId}>
                    <p>{`${paramInfo.name} [${paramInfo.symbol}]`}</p>
                    <p>{param.value}</p>
                  </div>
                );
              })}
              <div className="flex flex-1 border"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
