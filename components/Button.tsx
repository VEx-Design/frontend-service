import { cn } from "@/lib/utils";
import React from "react";
import { mainColors } from "./colors";

interface Props {
  children: React.ReactNode;
  handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "sensitive";
}

export default function Button(props: Props) {
  const variant = props.variant ? props.variant : "primary";
  return (
    <button
      className={cn("px-4 py-2 rounded-lg", mainColors[variant])}
      onClick={props.handleButtonClick}
    >
      {props.children}
    </button>
  );
}
