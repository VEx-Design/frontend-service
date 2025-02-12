import { useExecution } from "@/features/systems/contexts/ExecutionContext";
import React from "react";

export default function EdgeInfomation() {
  const { focusEdge } = useExecution();
  const light = focusEdge?.data?.light;

  if (!light) return null;
  return (
    <div>
      <p>{focusEdge?.id}</p>
      <div>
        {light.input.map((input) => (
          <div key={input.paramId}>
            <p>{input.paramId}</p>
            <p>{input.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
