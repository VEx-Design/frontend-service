import SymbolDisplay from "@/components/SymbolDisplay";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { LightParam } from "@/features/systems/libs/ClassLight/types/Light";
import React from "react";

interface LightPropertyBoxProps {
  lightParam: LightParam;
}

export default function LightPropertyBox({
  lightParam,
}: LightPropertyBoxProps) {
  const { configAction } = useConfig();
  const parameter = configAction.getParameter(lightParam.paramId);

  if (!parameter) {
    return null;
  }

  return (
    <div className="flex py-2 px-3 border border-editbar-border rounded-xl gap-2">
      <div className="flex items-center">
        <SymbolDisplay symbol={parameter.symbol} />
        <p className="text-sm ms-1">{` : ${parameter.name}`}</p>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="text-sm font-bold">{" = "}</span>
        <input
          className="w-full border border-editbar-border rounded-md p-1 text-sm"
          type="number"
          value={lightParam.value}
          disabled
        />
      </div>
    </div>
  );
}
