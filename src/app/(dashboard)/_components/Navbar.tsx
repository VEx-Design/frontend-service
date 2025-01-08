"use client";

import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex justify-between items-center border-b px-2 py-2 h-[50px]">
      <Image
        src="/VExDesign.svg"
        alt="Logo"
        width={70}
        height={200}
        layout="intrinsic"
      />
    </div>
  );
}
