import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import React from "react";
import ParamDropdown from "./ParamDropdown";
import SymbolDisplay from "@/components/SymbolDisplay";

interface ParamItemProps {
  param: Parameter;
  paramGroup?: string;
}

export default function ParamItem({ param, paramGroup }: ParamItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex items-center">
        <SymbolDisplay symbol={param.symbol} />
        <p className="text-sm ms-1">{` : ${param.name}`}</p>
      </div>
      {!param.isStadard && (
        <ParamDropdown param={param} paramGroup={paramGroup} />
      )}
    </div>
  );
}
