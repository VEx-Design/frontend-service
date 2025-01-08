"use client";

import React, { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

interface SortDropdownProps {
  onSortChange: (
    option: "Last Modified" | "Created on" | "A - Z" | "Z - A"
  ) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [option, setOption] = useState<
    "Last Modified" | "Created on" | "A - Z" | "Z - A"
  >("Last Modified");

  const ToggleDrop = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (
    option: "Last Modified" | "Created on" | "A - Z" | "Z - A"
  ) => {
    onSortChange(option);
    setOption(option);
    setIsOpen(false);
  };

  const OnMouseLeave = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative" onMouseLeave={OnMouseLeave}>
      <div
        className={`flex p-1 hover:bg-B1 rounded-md ${isOpen ? "bg-B1" : ""}`}
        onClick={ToggleDrop}
      >
        {isOpen ? (
          <RiArrowDropDownLine size={20} />
        ) : (
          <RiArrowDropUpLine size={20} />
        )}
        <div className="text-sm">{option}</div>
      </div>

      {isOpen && (
        <div className="absolute origin-top-right right-0 bg-white shadow-lg p-2 rounded-b-xl rounded-l-xl z-50 transition  hover:translate-y-1">
          <ul className="text-sm">
            <li
              className="text-nowrap p-2 hover:bg-B1  hover:rounded-md"
              onClick={() => handleOptionClick("Last Modified")}
            >
              Last Modified
            </li>
            <li
              className="text-nowrap p-2 hover:bg-B1  hover:rounded-md"
              onClick={() => handleOptionClick("Created on")}
            >
              Created on
            </li>
            <li
              className="text-nowrap p-2 hover:bg-B1  hover:rounded-md"
              onClick={() => handleOptionClick("A - Z")}
            >
              A - Z
            </li>
            <li
              className="text-nowrap p-2 hover:bg-B1  hover:rounded-md"
              onClick={() => handleOptionClick("Z - A")}
            >
              Z - A
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
