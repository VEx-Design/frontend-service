import SymbolDisplay from "@/components/SymbolDisplay";
import { Property } from "@/features/systems/libs/ClassType/types/Type";
import { getUnitById } from "@/features/systems/libs/UnitManagement/unit";
import React from "react";

interface Props {
  property: Property;
}

export default function PropertyBox(props: Props) {
  return (
    <div className="w-full flex flex-1 flex-col border border-gray-300 rounded-xl py-2 px-3">
      <div className="text-sm flex">
        <div className="flex items-center">
          {`${props.property.name}`}
          {" ["}
          <SymbolDisplay symbol={props.property.symbol} />
          {"]"}
        </div>
        <span className="ms-2 italic">
          {`(${getUnitById(props.property.unitId)?.symbol})`}
        </span>
      </div>
      <p className="text-xs">{props.property.description}</p>
    </div>
  );
}
