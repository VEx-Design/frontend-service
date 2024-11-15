"use client";

import React from "react";
import Logo from "../assets/Logo.png";
import Image from "next/image";
import { IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const ToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="bg-transparent text-M1 flex justify-between px-10 py-4 h-20">
      <div className="flex gap-3 items-center">
        <a href="#" className="flex justify-center items-center">
          <Image src={Logo} alt="Logo" height={24} width={43} />
        </a>
        <p className="font-bold text-3xl">VExDesign</p>
      </div>

      <ul className="text-lg font-medium items-center hidden md:flex">
        <li className="p-4">Overview</li>
        <li className="p-4">Features</li>
        <li className="p-4">Contact us</li>
      </ul>

      <div className="hidden md:flex justify-center items-center">
        <button className="border border-white px-5 py-2 font-bold text-H4 rounded-lg">
          Sign In
        </button>
      </div>

      <div className="flex items-center md:hidden" onClick={ToggleNav}>
        <IoMenu size={40} />
      </div>

      {/* menu dropdown */}
      <div
        className={`bg-C1 fixed right-0 top-0 min-w-[200px] h-screen px-4 transition-transform duration-500 ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end h-20" onClick={ToggleNav}>
          <IoClose size={40} />
        </div>
        <ul className="mb-2">
          <li className="p-4 border-b border-gray-400 hover:bg-gray-400">
            Overview
          </li>
          <li className="p-4 border-b border-gray-400 hover:bg-gray-400">
            Features
          </li>
          <li className="p-4 border-b border-gray-400 hover:bg-gray-400">
            Contact us
          </li>
          <li className="p-4 hover:bg-gray-400">Sign In</li>
        </ul>
      </div>
    </div>
  );
}
