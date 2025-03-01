import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import React from "react";
import ParamDropdown from "./ParamDropdown";

interface ParamItemProps {
  param: Parameter;
  paramGroup?: string;
}

export default function ParamItem({ param, paramGroup }: ParamItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <p className="text-sm font-bold">{`${param.name} [${param.symbol}]`}</p>
      <ParamDropdown param={param} paramGroup={paramGroup} />
    </div>
  );
}
