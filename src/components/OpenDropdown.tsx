"use client";

import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function OpenDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ToggleDrop = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };
  return (
    <div className="flex p-2 hover:bg-B1 rounded-md" onClick={ToggleDrop}>
      <RiArrowDropDownLine size={24} />
      <div>Last opened</div>
    </div>
  );
}
