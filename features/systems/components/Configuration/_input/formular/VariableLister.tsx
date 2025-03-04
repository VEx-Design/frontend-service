import React from "react";
import VariableBadge from "./VariableBadge";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";

export default function VariableLister() {
  const { config } = useConfig();
  const { currentType } = useConfigType();
  const { currentInterface } = useConfigInterface();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <p className="text-sm">Type variable:</p>
        {currentType?.properties.length === 0 ? (
          <p className="text-xs font-thin text-gray-500">No properties</p>
        ) : (
          <div className="flex gap-2">
            {currentType?.properties.map((prop) => (
              <VariableBadge key={prop.id} type="prop" prop={prop} canClick />
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <p className="text-sm font-thin">{`${currentInterface?.name}:`}</p>
        <div className="flex gap-2">
          {config.parameters.map((param) => (
            <VariableBadge
              key={currentInterface?.id + param.id}
              type="interface"
              inter={currentInterface}
              param={param}
              canClick
            />
          ))}
        </div>
      </div>
    </div>
  );
}
