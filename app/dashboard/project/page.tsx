import React from "react";
import Image from "next/image";
import Empty from "../_components/Empty";
import OwnDropdown from "@/app/components/OwnDropdown";
import OpenDropdown from "@/app/components/OpenDropdown";
import ListDisplay from "@/public/icons/DisplayCardIcons/ph_list-light.svg";
import CardDisplay from "@/public/icons/DisplayCardIcons/ri_gallery-view-2.svg";

export default function Project() {
  return (
    <>
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H3 font-bold">Project</div>
        <button className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500">
          + Project
        </button>
      </div>
      <div className="flex flex-none items-end sm:items-center justify-between py-4 flex-col sm:flex-row">
        {/* Swap Display */}
        <div className="flex gap-1">
          <div className="p-2  hover:bg-B1 rounded-md">
            <Image src={CardDisplay} alt="CardIcon" />
          </div>
          <div className="p-2  hover:bg-B1 rounded-md">
            <Image src={ListDisplay} alt="ListIcon" />
          </div>
        </div>
        <div className="flex gap-4">
          <OwnDropdown />
          <OpenDropdown />
        </div>
      </div>
      <div className="flex-1 h-[calc(100vh-235px)] ">
        <Empty />
      </div>
    </>
  );
}
