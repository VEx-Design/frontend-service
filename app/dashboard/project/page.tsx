import React from "react";
import Empty from "../_components/Empty";
import Titlebar from "../_components/Titlebar";

export default function Project() {
  return (
    <>
      <Titlebar title="Project" buttonAction="redirect" />
      <div className="flex-1 h-[calc(100vh-235px)] ">
        <Empty />
      </div>
    </>
  );
}
