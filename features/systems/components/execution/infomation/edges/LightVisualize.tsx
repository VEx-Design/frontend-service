import React from "react";
import BeamCrossSectional from "../BeamCrossSectional";
import PolarizationScene from "../PolarizationCanvas";
import { useLightInfo } from "@/features/systems/contexts/Execution/LightInfoContext";

export default function LightVisualize() {
  const { lightInfo, lightParam } = useLightInfo();
  if (!lightInfo) {
    return null;
  }
  const rx = lightParam("e82e6c79-4e2b-457f-aef7-02ab28cd19c1");
  const ry = lightParam("c1ff5f01-8383-44e3-b5f1-b2aca399c8fd");
  const Ex = lightParam("4f1cf485-92ba-4152-a731-ea0ccfae7b93");
  const Ey = lightParam("678d3330-961c-442b-8a9e-12df7536ee6e");
  return (
    <div className="flex flex-1 h-full">
      <div className="flex w-[50%] flex-col border-r h-full">
        <div className="h-[50%] justify-center">
          <BeamCrossSectional
            rx={(rx?.value ?? 0) * 10}
            ry={(ry?.value ?? 0) * 10}
          />
        </div>
        <div className="h-[50%]  border-t">in</div>
      </div>
      <div className="flex w-[50%] flex-col h-full">
        <div className="h-[50%] justify-center">
          <div className="w-full h-full">
            <PolarizationScene
              Ex={Ex?.value ?? 0}
              Ey={Ey?.value ?? 0}
              phase={0}
            />
          </div>
        </div>
        <div className="h-[50%] border-t">in</div>
      </div>
    </div>
  );
}
