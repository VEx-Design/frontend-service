import Dropdown from "@/components/Dropdown";
import { Position } from "@xyflow/react";
import React from "react";
import { cn } from "@/lib/utils";
import { Interface } from "@/features/systems/libs/ClassInterface/types/Interface";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";

interface Props {
  id: string;
  name: string;
  position: Position;
}

export default function InterfaceBox({ id, name, position }: Props) {
  const { configAction } = useConfig();
  const { currentType, setCurrentType } = useConfigType();
  const { currentInterface, setCurrentInterface, interfaceAction } =
    useConfigInterface();

  /** dropdown handler */
  const updateLocation = (newPosition: Position) => {
    interfaceAction.editLocation(newPosition);
  };

  const ownerItems = Object.values(Position).map((pos) => ({
    name: pos,
    onClick: () => updateLocation(pos),
  }));

  const onInterfaceClick = () => {
    const selectedInterface = currentType?.interfaces.find(
      (item: Interface) => item.id === id
    );
    if (selectedInterface) {
      setCurrentInterface(selectedInterface);
      setCurrentType(configAction.getType(currentType?.id || ""));
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
      <Dropdown items={ownerItems} value={position} />
    </div>
  );
}
