import { useExecution } from "@/features/systems/contexts/ExecutionContext";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import React from "react";

export default function EdgeInfomation() {
  const { focusEdge } = useExecution();
  const light = focusEdge?.data?.light;

  const { configAction } = useProject();

  if (!light) return null;
  return (
    <div>
      {/* <p>{focusEdge?.id}</p> */}
      <div>
        {light.input.map((input) => {
          const param = configAction.getParameter(input.paramId);
          return (
            <div key={input.paramId}>
              <p>{`${param.name} [${param.symbol}]`}</p>
              <p>{input.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
