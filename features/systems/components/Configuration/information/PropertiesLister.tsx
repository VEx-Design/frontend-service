import React from "react";
import CreatePropertyDialog from "./CreatePropertyDialog";
import { useConfig } from "@/features/systems/contexts/ConfigContext";
import PropertyBox from "./PropertyBox";

export default function PropertiesLister() {
  const { currentType } = useConfig();

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
