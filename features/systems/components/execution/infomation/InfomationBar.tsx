import React from "react";
import EdgeInfomation from "./edges/EdgeInfomation";
import PolarizationCanvas from "./edges/PolarizationCanvas";

export default function InfomationBar() {
  return (
    <div>
      <EdgeInfomation />
      <div className="flex flex-row gap-4">
        <PolarizationCanvas />
        <PolarizationCanvas />
      </div>
    </div>
  );
}
