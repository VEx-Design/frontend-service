import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import Titlebar from "../_components/Titlebar";

export default async function Library() {
  const user = await currentUser();
  //console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full">
      {/* Left */}
      <div className="flex-1">
        <Titlebar title="Library" buttonAction="popup" />
        <div className="flex-1 h-[calc(100vh-235px)] flex justify-center items-center ">
          Empty Library
        </div>
      </div>
      {/* Divide Line */}
      <div className="flex-none border"></div>
      {/* Right */}
      <div className="flex-1">
        <Titlebar title="Type" buttonAction="popup" />
        <div className="flex-1 h-[calc(100vh-235px)] flex justify-center items-center ">
          Empty Type
        </div>
      </div>
    </div>
  );
}
