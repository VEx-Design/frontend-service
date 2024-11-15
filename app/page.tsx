import React from "react";
import Navbar from "./sections/Navbar";
import Overview from "./components/Overview";

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
