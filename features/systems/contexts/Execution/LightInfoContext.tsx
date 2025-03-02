import { createContext, useContext, useEffect, useState } from "react";
import { Light, LightParam } from "../../libs/ClassLight/types/Light";
import { useExecution } from "./ExecutionContext";
import getLightParam from "../../libs/ClassLight/getLightParam";

interface LightInfoContextValue {
  lightInfo: Light | undefined;
  setLightInfo: (light: Light | undefined) => void;
  focusDistance: number;
  setFocusDistance: (focusDistance: number) => void;
  lightParam: (paramId: string) => LightParam | undefined;
}

const LightInfoContext = createContext<LightInfoContextValue | undefined>(
  undefined
);

export function LightInfoProvider(props: { children: React.ReactNode }) {
  const [lightInfo, setLightInfo] = useState<Light | undefined>(undefined);
  const [focusDistance, setFocusDistance] = useState(0);
  const { focusEdge } = useExecution();

  useEffect(() => {
    setLightInfo(focusEdge?.data?.lights?.[0]);
  }, [focusEdge?.data?.lights, focusEdge?.id]);

  const lightParam = (paramId: string): LightParam | undefined => {
    return lightInfo ? getLightParam(lightInfo, paramId) : undefined;
  };

  return (
    <LightInfoContext.Provider
      value={{
        lightInfo,
        setLightInfo,
        focusDistance,
        setFocusDistance,
        lightParam,
      }}
    >
      {props.children}
    </LightInfoContext.Provider>
  );
}

export function useLightInfo() {
  const context = useContext(LightInfoContext);
  if (!context) {
    throw new Error("useLightInfo must be used within a LightInfoProvider");
  }
  return context;
}
