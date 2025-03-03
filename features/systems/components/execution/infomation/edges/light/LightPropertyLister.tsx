import { useLightInfo } from "@/features/systems/contexts/Execution/LightInfoContext";
import React, { useEffect, useState } from "react";
import LightPropertyBox from "./LightPropertyBox";
import { useResizeDetector } from "react-resize-detector";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LightPropertyLister() {
  const { lightInfo } = useLightInfo();
  const hiddenParamId = [
    "e82e6c79-4e2b-457f-aef7-02ab28cd19c1",
    "c1ff5f01-8383-44e3-b5f1-b2aca399c8fd",
  ];
  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    if (height) {
      setParentHeight(height); // Update height automatically
    }
  }, [height]);

  return (
    <div ref={ref} className="flex h-full flex-col gap-2 px-4 py-2 bg-white">
      <ScrollArea style={{ height: parentHeight - 15 }}>
        <div className="flex flex-col gap-2">
          {lightInfo?.params
            .filter((param) => !hiddenParamId.includes(param.paramId))
            .map((param) => {
              return (
                <LightPropertyBox key={param.paramId} lightParam={param} />
              );
            })}
        </div>
      </ScrollArea>
    </div>
  );
}
