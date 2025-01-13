import { cn } from "@/lib/utils";
import React from "react";
import { mainColors } from "./colors";

export type BadgeVariant = "primary" | "secondary" | "sensitive";

interface Props {
  text: string;
  variant?: BadgeVariant;
}

export default function Badge(props: Props) {
  const variant = props.variant ? props.variant : "primary";
  return (
    <span className={cn("px-3 py-1 rounded-lg text-xs", mainColors[variant])}>
      {props.text}
    </span>
  );
}
