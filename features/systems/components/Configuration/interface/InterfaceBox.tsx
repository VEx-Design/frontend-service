import Dropdown from "@/components/Dropdown";
import { Position } from "@xyflow/react";
import React from "react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/features/systems/contexts/ConfigContext";
import editLocation from "@/features/systems/libs/ClassInterface/editLocation";
import { Interface } from "@/features/systems/libs/ClassInterface/types/Interface";

interface Props {
  id: string;
  name: string;
  location: Position;
}

export default function InterfaceBox({ id, name, location }: Props) {
  const { currentType, currentInterface, setCurrentInterface, typeAction } =
    useConfig();

  /** dropdown handler */
  const updateLocation = (newLocation: Position) => {
    if (!currentType) return;
    typeAction.editInterface(id, editLocation(currentInterface!, newLocation));
  };

  const ownerItems = Object.values(Position).map((pos) => ({
    name: pos,
    onClick: () => updateLocation(pos),
  }));

  const onInterfaceClick = () => {
    const selectedInterface = currentType?.interface.find(
      (item: Interface) => item.id === id
    );
    if (selectedInterface) {
      setCurrentInterface(selectedInterface);
    }
  };

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
