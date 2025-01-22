"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { mainColors } from "./colors";

interface Props {
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  handleButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "sensitive" | "danger";
  className?: string;
}

export default function Button(props: Props) {
  const variant = props.variant ? props.variant : "primary";
  return (
    <button
      type={props.type}
      className={cn(
        "px-4 py-2 rounded-lg",
        mainColors[variant],
        props.className
      )}
      onClick={props.handleButtonClick}
    >
      {props.children}
    </button>
  );
}
