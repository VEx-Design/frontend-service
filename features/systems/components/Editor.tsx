import React from "react";
import { ReactFlow, Controls, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Editor() {
  return (
    <div className="h-full">
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
