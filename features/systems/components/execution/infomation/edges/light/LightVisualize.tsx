import React from "react";
import BeamCrossSectional from "../../BeamCrossSectional";
import PolarizationScene from "../../PolarizationCanvas";
import { useLightInfo } from "@/features/systems/contexts/Execution/LightInfoContext";
import LightOutput from "./LightOutput";

export default function LightVisualize() {
  const { lightInfo, lightParam } = useLightInfo();
  if (!lightInfo) {
    return null;
  }

  const rx = lightParam("e82e6c79-4e2b-457f-aef7-02ab28cd19c1");
  const ry = lightParam("c1ff5f01-8383-44e3-b5f1-b2aca399c8fd");

  const S0 = lightParam("4f1cf485-92ba-4152-a731-ea0ccfae7b93")?.value ?? 0;
  const S1 = lightParam("678d3330-961c-442b-8a9e-12df7536ee6e")?.value ?? 0;
  const S2 = lightParam("c039c4d3-8e79-42b8-9c31-486e0cf36b20")?.value ?? 0;
  const S3 = lightParam("f0505ffe-6fa4-41ed-8cbe-b39d72d9c9f5")?.value ?? 0;

  const isUnpolarized = S1 === 0 && S2 === 0 && S3 === 0;

  const Ex: number = isUnpolarized ? 0 : Math.sqrt((S0 + S1) / 2);
  const Ey: number = isUnpolarized ? 0 : Math.sqrt((S0 - S1) / 2);
  const phase: number = isUnpolarized ? 0 : Math.atan2(S3, S2);

  return (
    <div className="flex flex-1 h-full">
      <div className="flex w-[50%] flex-col border-r h-full">
        <div className="h-[50%] justify-center">
          <BeamCrossSectional
            rx={(rx?.value ?? 0) * 10}
            ry={(ry?.value ?? 0) * 10}
          />
        </div>
        <div className="border-t flex flex-1 flex-col gap-2 p-2">
          <LightOutput symbol="r_x" value={rx?.value ?? 0} />
          <LightOutput symbol="r_y" value={ry?.value ?? 0} />
        </div>
      </div>
      <div className="flex w-[50%] flex-col h-full">
        {isUnpolarized ? (
          <div className="flex flex-1 justify-center mt-4 text-gray-500">
            Unpolarized
          </div>
        ) : (
          <>
            <div className="h-[40%] justify-center">
              <div className="w-full h-full">
                <PolarizationScene Ex={Ex} Ey={Ey} phase={phase} />
              </div>
            </div>
            <div className="border-t flex flex-1 flex-col gap-2 p-2">
              <LightOutput symbol="E_x" value={Ex} />
              <LightOutput symbol="E_y" value={Ey} />
              <LightOutput symbol="phase" value={phase} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
