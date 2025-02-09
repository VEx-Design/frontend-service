import { useConfig } from "@/features/systems/contexts/ConfigContext";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import React from "react";

export default function FormulaLister() {
  const { config } = useProject();
  const { currentInterface } = useConfig();

  return (
    <div>
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H5 font-bold">{currentInterface?.name}</div>
      </div>
      <div className="flex flex-col mt-4 gap-2">
        {config.parameters.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between py-3 px-3 border border-editbar-border rounded-xl cursor-pointer gap-2"
          >
            <span className="text-sm font-bold">{`${item.name} [${item.symbol}]`}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{" = "}</span>
              <input
                className="border border-editbar-border rounded-md p-1 bg-white text-sm w-full"
                type="text"
                onChange={() => {}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
