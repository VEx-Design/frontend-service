"use client";

import React, { useState } from "react";
import Items from "./items";
import Home from "@/public/icons/Home.svg";
import Library from "@/public/icons/Library.svg";
import Warehouse from "@/public/icons/Object.svg";
import Bookmark from "@/public/icons/Bookmark.svg";
import Community from "@/public/icons/Community.svg";
import ObjectList from "@/public/icons/Bookshelf.svg";

export default function PageList() {
  const [activePath, setActivePath] = useState<string>("/project");
  const handleActivePath = (href: string) => {
    setActivePath(href);
  };
  return (
    <div className="text-C1 w-full">
      <ul className="flex flex-col space-y-3 ">
        <Items
          href={"/project"}
          icon={Home}
          title={"Project"}
          isActive={activePath === "/project"}
          onClick={handleActivePath}
        />
        <Items
          href={"/library"}
          icon={Library}
          title={"Library"}
          isActive={activePath === "/library"}
          onClick={handleActivePath}
        />
        <Items
          href={"/object"}
          icon={ObjectList}
          title={"Object"}
          isActive={activePath === "/object"}
          onClick={handleActivePath}
        />
        <Items
          href={"/warehouse"}
          icon={Warehouse}
          title={"Warehouse"}
          isActive={activePath === "/warehouse"}
          onClick={handleActivePath}
        />
        <Items
          href={"/community"}
          icon={Community}
          title={"Community"}
          isActive={activePath === "/community"}
          onClick={handleActivePath}
        />
        <Items
          href={"/bookmark"}
          icon={Bookmark}
          title={"Bookmark"}
          isActive={activePath === "/bookmark"}
          onClick={handleActivePath}
        />
      </ul>
    </div>
  );
}
