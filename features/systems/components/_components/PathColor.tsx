import React from "react";

interface PathColorProps {
  color: string;
}

export default function PathColor({ color }: PathColorProps) {
  return (
    <div
      style={{ backgroundColor: color }}
      className="rounded-full h-5 w-5 border-2 border-white"
    ></div>
  );
}
