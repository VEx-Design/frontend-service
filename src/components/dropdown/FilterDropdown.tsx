"use client";

import React, { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

interface OwnDropdownProps {
  onFilterChange: (option: "All" | "Own by me" | "Own by anyone") => void;
}

function OwnDropdown({ onFilterChange }: OwnDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [option, setOption] = useState<"All" | "Own by me" | "Own by anyone">(
    "All"
  );

  const ToggleDrop = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: "All" | "Own by me" | "Own by anyone") => {
    onFilterChange(option);
    setOption(option);
    setIsOpen(false);
  };

  const OnMouseLeave = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative " onMouseLeave={OnMouseLeave}>
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
              onClick={() => handleOptionClick("All")}
            >
              All
            </li>
            <li
              className="text-nowrap p-2 hover:bg-B1  hover:rounded-md"
              onClick={() => handleOptionClick("Own by me")}
            >
              Own by me
            </li>
            <li
              className="text-nowrap p-2 hover:bg-B1  hover:rounded-md"
              onClick={() => handleOptionClick("Own by anyone")}
            >
              Own by anyone
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default OwnDropdown;
