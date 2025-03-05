"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import FormulaConditionBox from "../_input/formular/FormulaConditionBox";
import AddActionDialogProps from "./AddActionDialog";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const MemoizedFormulaConditionBox = React.memo(FormulaConditionBox);

export default function FormulaLister() {
  const { currentInterface } = useConfigInterface();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.offsetHeight;
        setContainerHeight(newHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col h-full">
      <div className="flex flex-none items-center justify-between border-b pb-4">
        <div className="text-H5 font-bold">{currentInterface?.name}</div>
        <AddActionDialogProps />
      </div>
      <div className="flex flex-1 py-2">
        <ScrollArea
          className="flex-1 w-full"
          style={{ height: `${containerHeight - 60}px` }}
        >
          <div className="pr-1">
            <div className="flex flex-1 flex-col gap-4 mt-4">
              {currentInterface?.formulaConditions?.map((condition, index) => (
                <MemoizedFormulaConditionBox
                  key={condition.id || index}
                  condition={condition}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
