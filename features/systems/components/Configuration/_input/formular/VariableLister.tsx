import React from "react";
import VariableBadge from "./VariableBadge";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { useConfig } from "@/features/systems/contexts/ConfigContext";

export default function VariableLister() {
  const { config } = useProject();
  const { currentType } = useConfig();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <p className="text-sm">Type variable:</p>
        <div className="flex gap-2">
          {currentType?.properties.map((prop) => (
            <VariableBadge key={prop.id} type="prop" prop={prop} canClick />
          ))}
        </div>
      </div>
      {currentType?.interfaces.map((inter) => (
        <div key={inter.id} className="flex gap-2">
          <p className="text-sm font-thin">{`${inter.name}:`}</p>
          <div className="flex gap-2">
            {config.parameters.map((param) => (
              <VariableBadge
                key={inter.id + param.id}
                type="interface"
                inter={inter}
                param={param}
                canClick
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
