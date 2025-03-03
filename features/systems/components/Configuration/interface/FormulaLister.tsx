import React, { useEffect, useState } from "react";
import FormulaConditionBox from "../_input/formular/FormulaConditionBox";
import { useResizeDetector } from "react-resize-detector";
import AddActionDialogProps from "./AddActionDialog";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";

const MemoizedFormulaConditionBox = React.memo(FormulaConditionBox);

export default function FormulaLister() {
  const { currentInterface } = useConfigInterface();
  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    if (height) {
      setParentHeight(height); // Update height automatically
    }
  }, [height]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H5 font-bold">{currentInterface?.name}</div>
        <AddActionDialogProps />
      </div>
      <div ref={ref} className="flex flex-1 py-2">
        <div className="flex flex-1 overflow-auto scrollbar">
          <div className="w-full pr-1" style={{ maxHeight: parentHeight }}>
            <div className="flex flex-1 flex-col gap-4 mt-4">
              {currentInterface?.formulaConditions?.map((condition, index) => (
                <MemoizedFormulaConditionBox
                  key={condition.id || index}
                  condition={condition}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
