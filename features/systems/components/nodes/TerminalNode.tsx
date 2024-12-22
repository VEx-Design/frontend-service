import React from "react";
import { LogOutIcon } from "lucide-react";

function TerminalNode() {
  return (
    <div className="p-6 bg-blue-500 rounded-full justify-center items-center">
      <LogOutIcon size={36} className="stroke-white" />
    </div>
  );
}

export default TerminalNode;
