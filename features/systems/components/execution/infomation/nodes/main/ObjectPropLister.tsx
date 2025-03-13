import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import ObjectPropertyBox from "./ObjectPropertyBox";

export default function ObjectPropLister() {
  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);
  const { focusNode } = useExecution();

  useEffect(() => {
    if (height) {
      setParentHeight(height); // Update height automatically
    }
  }, [height]);

  return (
    <div className="flex w-full h-full flex-col px-4 py-2 bg-white">
      <div ref={ref} className="flex flex-col flex-1 h-full">
        <ScrollArea
          style={{ height: parentHeight }} // Adjusted for search input height
          scrollHideDelay={0}
        >
          <div className="flex flex-col gap-2 h-full">
            {focusNode?.data.object?.vars.map((variable) => (
              <ObjectPropertyBox key={variable.propId} objVariable={variable} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
