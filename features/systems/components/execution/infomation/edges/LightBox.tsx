import { Light } from "@/features/systems/libs/ClassLight/types/Light";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  index: number;
  light: Light;
}

export default function LightBox({ index }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3 border border-editbar-border rounded-xl cursor-pointer",
        {
          //   "border-s-8 border-s-gray-300": currentInterface?.id === id,
        }
      )}
    >
      <span
        className={cn("text-sm", {
          //   "font-bold": currentInterface?.id === id,
        })}
      >
        {`Light ${index + 1}`}
      </span>
    </div>
  );
}
