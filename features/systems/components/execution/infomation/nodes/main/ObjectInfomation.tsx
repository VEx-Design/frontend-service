import React from "react";
import TypeInfo from "./TypeInfo";
import ObjectPropLister from "./ObjectPropLister";

export default function ObjectInfomation() {
  return (
    <div className="flex flex-col h-full w-full">
      <TypeInfo />
      <ObjectPropLister />
    </div>
  );
}
