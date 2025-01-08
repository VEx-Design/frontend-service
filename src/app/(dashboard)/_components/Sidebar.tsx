import React from "react";
import Link from "next/link";
import Image from "next/image";
import Home from "@/public/icons/Home.svg";
import Library from "@/public/icons/Library.svg";
import ObjectList from "@/public/icons/Bookshelf.svg";
import Warehouse from "@/public/icons/Object.svg";
import Community from "@/public/icons/Community.svg";
import Bookmark from "@/public/icons/Bookmark.svg";

export default function Sidebar() {
  return (
    <div className="min-h-full border-r px-2">
      <ul className="flex flex-col space-y-2">
        <Link href="/project">
          <li className="p-2 hover:bg-B1 hover:rounded-md ">
            <Image src={Home} alt="Home" width={24} height={24} />
          </li>
        </Link>
        <Link href="/library">
          <li className="p-2 hover:bg-B1 hover:rounded-md">
            <Image src={Library} alt="Library" width={24} height={24} />
          </li>
        </Link>
        <Link href="/object">
          <li className="p-2 hover:bg-B1 hover:rounded-md">
            <Image src={ObjectList} alt="ObjectList" width={24} height={24} />
          </li>
        </Link>
        <Link href="/warehouse">
          <li className="p-2 hover:bg-B1 hover:rounded-md">
            <Image src={Warehouse} alt="Warehouse" width={24} height={24} />
          </li>
        </Link>
        <Link href="/community">
          <li className="p-2 hover:bg-B1 hover:rounded-md">
            <Image src={Community} alt="Community" width={24} height={24} />
          </li>
        </Link>
        <Link href="/bookmark">
          <li className="p-2 hover:bg-B1 hover:rounded-md">
            <Image src={Bookmark} alt="Bookmark" width={24} height={24} />
          </li>
        </Link>
      </ul>
    </div>
  );
}
