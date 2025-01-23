import React from "react";
import TypeLister from "./TypeLister";

export default function SelectionSide() {
  return (
    <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3 overflow-y-auto">
      <TypeLister />
    </div>
  );
}
