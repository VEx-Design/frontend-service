import React from "react";
import InputLightSelector from "./InputLightSelector";
import InputPropLister from "./InputPropLister";
import InputVisualize from "./InputVisualize";

export default function InputLight() {
  return (
    <div className="flex flex-col h-full w-full">
      <InputLightSelector />
      <div className="flex flex-1 h-full">
        <InputPropLister />
        <InputVisualize />
      </div>
    </div>
  );
}
