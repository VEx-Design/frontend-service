import React from "react";
import CreatePropertyDialog from "./CreatePropertyDialog";
import PropertyBox from "./PropertyBox";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";

export default function PropertiesLister() {
  const { currentType } = useConfigType();

  return (
    <div className="ms-6">
      <p className="text-sm font-semibold mb-3">Properties</p>
      <div className="flex flex-col gap-2">
        {currentType?.properties.map((property) => (
          <PropertyBox key={property.id} property={property} />
        ))}
        <CreatePropertyDialog />
      </div>
    </div>
  );
}
