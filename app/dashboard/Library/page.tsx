import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import Image from "next/image";
import OwnDropdown from "@/app/components/OwnDropdown";
import OpenDropdown from "@/app/components/OpenDropdown";
import ListDisplay from "@/public/icons/DisplayCardIcons/ph_list-light.svg";
import CardDisplay from "@/public/icons/DisplayCardIcons/ri_gallery-view-2.svg";

export default async function Library() {
  const user = await currentUser();
  // console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H3 font-bold">Library</div>
      </div>
      <div className="flex flex-row gap-5 mt-4">
        {/* Left */}
        <div className="flex-1">
          <div className="flex flex-none items-center justify-between border-b pb-4">
            <div className="text-H4">Parameter</div>
            <button className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500">
              + Parameter
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
          <div className="flex-1 h-[calc(100vh-300px)] flex justify-center items-center">
            Empty Parameter
          </div>
        </div>
        <div className="flex-none border"></div>
        {/* Right */}
        <div className="flex-1">
          <div className="flex flex-none items-center justify-between border-b pb-4">
            <div className="text-H4">Kind</div>
            <button className="bg-C1 text-white p-2 rounded-lg hover:bg-blue-500">
              + Kind
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
          <div className="flex-1 h-[calc(100vh-300px)] flex justify-center items-center">
            Empty Kind
          </div>
        </div>
      </div>
    </>
  );
}
