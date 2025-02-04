"use client";

import React, { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

interface DropdownItem {
  name: string;
  onClick: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
}

export default function Dropdown(props: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [option, setOption] = useState<string>(
    props.items.length > 0 ? props.value ?? props.items[0].name : ""
  );

  useEffect(() => {
    if (props.items.length > 0) {
      if (props.value) {
        setOption(props.value);
      } else {
        props.items[0].onClick();
      }
    }
  }, []);

  const OnMouseLeave = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative " onMouseLeave={OnMouseLeave}>
      <div
        className={`flex p-1 hover:bg-B1 rounded-md ${
          isOpen ? "bg-B1" : ""
        } cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <RiArrowDropDownLine size={24} />
        ) : (
          <RiArrowDropUpLine size={24} />
        )}
        <div className="text-sm">{option}</div>
      </div>

      {isOpen && (
        <div className="absolute origin-top-right right-0 bg-white shadow-lg p-2 rounded-b-xl rounded-l-xl z-50 transition  hover:translate-y-1">
          <ul className="text-sm">
            {props.items.map((item, index) => (
              <li
                key={index}
                className="text-nowrap p-2 hover:bg-B1 hover:rounded-md cursor-pointer"
                onClick={() => {
                  item.onClick();
                  setOption(item.name);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
