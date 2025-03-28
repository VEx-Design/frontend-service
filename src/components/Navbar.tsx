"use client";

import React from "react";
import Logo from "../../public/images/Logo.png";
import Image from "next/image";
import { IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const ToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="bg-transparent text-M1 flex justify-between px-10 py-4 h-20">
      <div className="flex gap-3 items-center">
        <a href="#" className="flex justify-center items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-7" priority />
        </a>
        <p className="font-bold text-3xl">VExDesign</p>
      </div>

      <ul className="text-lg font-medium items-center hidden md:flex">
        <li className="p-4 hover:underline underline-offset-4">
          <a href="#">Overview</a>
        </li>
        <li className="p-4 hover:underline underline-offset-4">
          <a href="#">Features</a>
        </li>
        <li className="p-4 hover:underline underline-offset-4">
          <a href="#">Contact us</a>
        </li>
      </ul>

      <div className="hidden md:flex justify-center items-center">
        <Link href="/sign-in">
          <button className="border border-white px-5 py-2 font-bold text-H4 rounded-lg hover:bg-white hover:text-C1">
            Sign In
          </button>
        </Link>
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
            <a href="#">Overview</a>
          </li>
          <li className="p-4 border-b border-gray-400 hover:bg-gray-400">
            <a href="#">Features</a>
          </li>
          <li className="p-4 border-b border-gray-400 hover:bg-gray-400">
            <a href="#">Contact us</a>
          </li>

          <li className="p-4 hover:bg-gray-400">
            <Link href="/sign-in">Sign In</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
