"use client";

import React, { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

function OwnDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ToggleDrop = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  return (
    <div className="relative">
      <div className="flex p-2 hover:bg-B1 rounded-md" onClick={ToggleDrop}>
        {isOpen ? (
          <RiArrowDropDownLine size={24} />
        ) : (
          <RiArrowDropUpLine size={24} />
        )}
        <div>All</div>
      </div>

      {/* menu dropdown */}
      <div className="absolute origin-top-right right-0 bg-white shadow-lg p-2 rounded-xl hidden">
        <ul className="text-sm">
          <li className="text-nowrap p-2 hover:bg-blue-400 hover:bg-opacity-50 hover:rounded-md">
            All
          </li>
          <li className="text-nowrap p-2 hover:bg-blue-400 hover:bg-opacity-50 hover:rounded-md">
            Own by me
          </li>
          <li className="text-nowrap p-2 hover:bg-blue-400 hover:bg-opacity-50 hover:rounded-md">
            Own by anyone
          </li>
        </ul>
      </div>
    </div>
  );
}

export default OwnDropdown;
