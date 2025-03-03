import React from "react";
import VariableBadge from "./VariableBadge";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

export default function VariableLister() {
  const { config } = useConfig();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <p className="text-sm">Distance:</p>
        <div className="flex gap-2">
          <VariableBadge type="distance" canClick />
        </div>
      </div>
      <div className="flex gap-2">
        <p className="text-sm font-thin">Parameter:</p>
        <div className="flex gap-2">
          {config.parameters.map((param) => (
            <VariableBadge
              key={param.id}
              type="parameter"
              param={param}
              canClick
            />
          ))}
        </div>
      </div>
    </div>
  );
}
