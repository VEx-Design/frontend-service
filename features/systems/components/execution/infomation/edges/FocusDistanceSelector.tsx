import Button from "@/components/Button";
import { Slider } from "@/components/ui/slider";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import { ChevronFirst, ChevronLast } from "lucide-react";
import React from "react";

export default function FocusDistanceSelector() {
  const { focusEdge, edgeAction } = useExecution();
  const focusDistance = focusEdge?.data.focusDistance ?? 0;
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <p className="font-bold text-sm">{`Focus Distance = ${focusDistance} mm`}</p>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="secondary"
          handleButtonClick={() => edgeAction.setFocusDistance(0)}
        >
          <ChevronFirst size={12} strokeWidth={4} />
        </Button>
        <Slider
          min={0}
          max={+(focusEdge?.data.distance ?? 100)}
          step={1}
          value={[focusDistance]}
          onValueChange={(value) => edgeAction.setFocusDistance(value[0])}
          className=" [&_[role=slider]]:bg-white [&_.bg-primary]:bg-C1"
        />
        <Button
          variant="secondary"
          handleButtonClick={() =>
            edgeAction.setFocusDistance(+(focusEdge?.data.distance ?? 100))
          }
        >
          <ChevronLast size={12} strokeWidth={4} />
        </Button>
      </div>
    </div>
  );
}
