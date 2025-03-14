import React from "react";
import OutputLightSelector from "./OutputLightSelector";
import OutputPropLister from "./OutputPropLister";
import OutputVisualize from "./OutputVisualize";

export default function OutputLight() {
  return (
    <div className="flex flex-col h-full w-full">
      <OutputLightSelector />
      <div className="flex flex-1 h-full">
        <OutputVisualize />
        <OutputPropLister />
      </div>
    </div>
  );
}
