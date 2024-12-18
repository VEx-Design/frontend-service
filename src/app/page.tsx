import React from "react";
import Navbar from "@/src/components/Navbar";
import Overview from "@/src/components/sections/Overview";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <Overview />
    </div>
  );
}
