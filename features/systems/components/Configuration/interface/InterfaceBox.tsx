import Dropdown from "@/components/Dropdown";
import { Position } from "@xyflow/react";
import React from "react";
import { Interface } from "@/features/systems/types/config";
import { cn } from "@/lib/utils";
import { ProjectContext } from "@/features/systems/contexts/ProjectContext";
import { ConfigContext } from "@/features/systems/contexts/ConfigConsoleContext";

interface Props {
  id: string;
  name: string;
  location: Position;
}

export default function InterfaceBox({ id, name, location }: Props) {
  const context = React.useContext(ProjectContext);
  if (!context)
    throw new Error("InterfaceBox must be used within a ProjectContext");

  const configContext = React.useContext(ConfigContext);
  if (!configContext)
    throw new Error("InterfaceBox must be used within a ConfigContext");
  const { currentInterface } = configContext;

  const onInterfaceClick = () => {
    const selectedInterface = context.currentType?.interface.find(
      (item: Interface) => item.id === id
    );
    if (selectedInterface) {
      configContext.setCurrentInterface(selectedInterface);
    }
  };

  const updateLocation = (newLocation: Position) => {
    if (!context.currentType) return;

    context.setCurrentType({
      ...context.currentType,
      interface: context.currentType.interface.map((item: Interface) =>
        item.id === id ? { ...item, location: newLocation } : item
      ),
    });
  };

  const ownerItems = Object.values(Position).map((pos) => ({
    name: pos,
    onClick: () => updateLocation(pos),
  }));

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3 border border-editbar-border rounded-xl cursor-pointer",
        {
          "border-s-8 border-s-gray-300": currentInterface?.id === id,
        }
      )}
      onClick={onInterfaceClick}
    >
      <span
        className={cn("text-sm", {
          "font-bold": currentInterface?.id === id,
        })}
      >
        {name}
      </span>
      <Dropdown items={ownerItems} value={location} />
    </div>
  );
}
