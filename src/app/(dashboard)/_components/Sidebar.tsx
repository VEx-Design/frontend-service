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
    <div className="min-h-full border-r px-5">
      <ul>
        <li className="p-4 hover:bg-B1 hover:rounded-md ">
          <Link href="/project">
            <Image src={Home} alt="Home" width={24} height={24} />
          </Link>
        </li>
        <li className="p-4 hover:bg-B1 hover:rounded-md">
          <Link href="/library">
            <Image src={Library} alt="Library" width={24} height={24} />
          </Link>
        </li>
        <li className="p-4 hover:bg-B1 hover:rounded-md">
          <Link href="/object">
            <Image src={ObjectList} alt="ObjectList" width={24} height={24} />
          </Link>
        </li>
        <li className="p-4 hover:bg-B1 hover:rounded-md">
          <Link href="/warehouse">
            <Image src={Warehouse} alt="Warehouse" width={24} height={24} />
          </Link>
        </li>
        <li className="p-4 hover:bg-B1 hover:rounded-md">
          <Link href="/community">
            <Image src={Community} alt="Community" width={24} height={24} />
          </Link>
        </li>
        <li className="p-4 hover:bg-B1 hover:rounded-md">
          <Link href="/bookmark">
            <Image src={Bookmark} alt="Bookmark" width={24} height={24} />
          </Link>
        </li>
      </ul>
    </div>
  );
}
