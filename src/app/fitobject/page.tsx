"use client";

import Navbar from "@/src/app/(dashboard)/_components/Navbar";
import Canvas from "./_components/Canvas";
import LeftSidebar from "./_components/sidebar/left-sidebar";
import RightSidebar from "./_components/sidebar/right-sidebar";

const FitObject = () => {
  return (
    <div className="h-full w-screen flex flex-col">
      <Navbar />
      <div className="h-full w-screen relative">
        <div className="absolute top-0 left-0 h-full z-10">
          <LeftSidebar />
        </div>

        <div className="absolute inset-0">
          <Canvas />
        </div>

        <div className="absolute top-0 right-0 h-full z-10">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default FitObject;
