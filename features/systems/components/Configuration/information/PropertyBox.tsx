import { Property } from "@/features/systems/libs/ClassType/types/Type";
import { getUnitById } from "@/features/systems/libs/UnitManagement/unit";
import React from "react";

interface Props {
  property: Property;
}

export default function PropertyBox(props: Props) {
  return (
    <div className="w-full flex flex-1 flex-col border border-gray-300 rounded-xl py-2 px-3">
      <p className="text-sm">
        {`${props.property.name} [${props.property.symbol}]`}
        <span className="ms-2 italic">
          {`(${getUnitById(props.property.unitId)?.symbol})`}
        </span>
      </p>
      <p className="text-xs">{props.property.description}</p>
    </div>
  );
}
