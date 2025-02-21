import React, { useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useConfig } from "../../contexts/ConfigContext";
import { useProject } from "../../contexts/ProjectContext";
import FormularBox from "./_input/freeSFormular/FormularBox";

export default function ConfigFreeS() {
  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    if (height) {
      setParentHeight(height);
    }
  }, [height]);

  const { currentConfigFreeS } = useConfig();
  const { config } = useProject();

  return (
    <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-r-1 border-editbar-border py-4 px-6">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-none items-center justify-between border-b pb-4">
          <div className="text-H4 font-bold">{`${currentConfigFreeS?.name} Free space configuration`}</div>
        </div>
        <div ref={ref} className="flex flex-1 py-2">
          <div className="flex flex-1 overflow-auto scrollbar">
            <div className="w-full pr-1" style={{ maxHeight: parentHeight }}>
              <div className="flex flex-1 flex-col gap-4 mt-4">
                {config.parameters.map((param, index) => (
                  <FormularBox key={param.id || index} param={param} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
