import PathColor from "@/features/systems/components/_components/PathColor";
import { useLightInfo } from "@/features/systems/contexts/Execution/LightInfoContext";
import { Light } from "@/features/systems/libs/ClassLight/types/Light";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  index: number;
  light: Light;
}

export default function LightTerminalBox({ index, light }: Props) {
  const { lightInfo, setLightInfo } = useLightInfo();
  const id = lightInfo?.id;

  const handleOnClick = () => {
    if (id === light.id) {
      return;
    }
    setLightInfo(light);
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3 border border-editbar-border rounded-xl cursor-pointer",
        {
          "border border-s-C1 border-s-8": light.id === id,
        }
      )}
      onClick={handleOnClick}
    >
      <span
        className={cn("text-sm", {
          "font-bold": light.id === id,
        })}
      >
        {`Light ${index + 1}`}
      </span>
      <PathColor color={light.path.color} />
    </div>
  );
}
