import React, { useEffect, useState } from "react";
import { useConfigInterface } from "@/features/systems/contexts/ConfigInterfaceContext";
import FormulaConditionBox from "../_input/formular/FormulaConditionBox";
import { useResizeDetector } from "react-resize-detector";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddConditionDialog from "./AddConditionDialog";

export default function FormulaLister() {
  const { currentInterface } = useConfigInterface();
  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    if (height !== undefined) {
      setParentHeight(height);
    }
  }, [height]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H5 font-bold">{currentInterface?.name}</div>
        <AddConditionDialog />
      </div>
      <div ref={ref} className="flex flex-1">
        <ScrollArea
          className="w-full"
          style={{ height: `${parentHeight - 15}px` }}
        >
          <div className="flex flex-1 flex-col gap-4 mt-4">
            {currentInterface?.formulaConditions?.map((condition) => (
              <FormulaConditionBox key={condition.id} condition={condition} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
