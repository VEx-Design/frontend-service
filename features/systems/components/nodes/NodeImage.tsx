"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

function NodeImage({
  imageUrl,
  isSelected,
}: {
  imageUrl: string;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-full cursor-pointer bg-background border-objectBorder border-2 border-separate w-[420px] text-xs gap-1 flex flex-col p-6",
        isSelected && "border-primary"
      )}
    >
      <Image
        src={imageUrl}
        alt="Node Image"
        width={50}
        height={50}
        className="rounded-t-md"
      />
    </div>
  );
}

export default NodeImage;
