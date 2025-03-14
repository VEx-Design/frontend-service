import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Light, LightParam } from "../../libs/ClassLight/types/Light";
import { useExecution } from "./ExecutionContext";
import { useConfig } from "../ProjectWrapper/ConfigContext";
import getDynamicLightParam from "../../libs/ClassLight/getDynamicLightParam";

interface LightInfoContextValue {
  lightInfo: Light | undefined;
  setLightInfo: (light: Light | undefined) => void;
  lightParam: (paramId: string) => LightParam | undefined;
}

const LightInfoContext = createContext<LightInfoContextValue | undefined>(
  undefined
);

export function LightInfoProvider(props: { children: React.ReactNode }) {
  const [lightInfo, setLightInfo] = useState<Light | undefined>(undefined);
  const { focusEdge, focusNode } = useExecution();
  const { config } = useConfig();

  useEffect(() => {
    setLightInfo(focusEdge?.data?.lights?.[0]);
  }, [focusEdge?.data?.lights, focusEdge?.id]);

  useEffect(() => {
    if (focusNode?.type === "starter") {
      setLightInfo(focusNode.data?.initials?.[0]);
    } else if (focusNode?.type === "terminal") {
      setLightInfo(focusNode.data?.mesurement?.[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNode?.data?.initials, focusNode?.data?.mesurement, focusNode?.id]);

  const lightParam = useCallback(
    (paramId: string): LightParam | undefined => {
      if (lightInfo) {
        return getDynamicLightParam(
          config,
          lightInfo,
          paramId,
          +(focusEdge?.data.focusDistance || 0)
        );
      }
      return undefined;
    },
    [config, focusEdge?.data.focusDistance, lightInfo]
  );

  return (
    <LightInfoContext.Provider
      value={{
        lightInfo,
        setLightInfo,
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
