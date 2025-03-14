import { createContext, useContext, useState } from "react";
import { Light } from "../../libs/ClassLight/types/Light";

interface NodeInfoContextValue {
  focusInputInterface: string | undefined;
  setFocusInputInterface: (interfaceId: string | undefined) => void;
  lightInputList: Light[];
  setLightInputList: (lightList: Light[]) => void;
  focusInputLight: string | undefined;
  setFocusInputLight: (lightId: string | undefined) => void;
  focusOutputInterface: string | undefined;
  setFocusOutputInterface: (interfaceId: string | undefined) => void;
  lightOutputList: Light[];
  setLightOutputList: (lightList: Light[]) => void;
  focusOutputLight: string | undefined;
  setFocusOutputLight: (lightId: string | undefined) => void;
}

const NodeInfoContext = createContext<NodeInfoContextValue | undefined>(
  undefined
);

export function NodeInfoProvider(props: { children: React.ReactNode }) {
  const [focusInputInterface, setFocusInputInterface] = useState<
    string | undefined
  >(undefined);
  const [lightInputList, setLightInputList] = useState<Light[]>([]);
  const [focusInputLight, setFocusInputLight] = useState<string | undefined>(
    undefined
  );
  const [focusOutputInterface, setFocusOutputInterface] = useState<
    string | undefined
  >(undefined);
  const [lightOutputList, setLightOutputList] = useState<Light[]>([]);
  const [focusOutputLight, setFocusOutputLight] = useState<string | undefined>(
    undefined
  );

  return (
    <NodeInfoContext.Provider
      value={{
        focusInputInterface,
        setFocusInputInterface,
        lightInputList,
        setLightInputList,
        focusInputLight,
        setFocusInputLight,
        focusOutputInterface,
        setFocusOutputInterface,
        lightOutputList,
        setLightOutputList,
        focusOutputLight,
        setFocusOutputLight,
      }}
    >
      {props.children}
    </NodeInfoContext.Provider>
  );
}

export function useNodeInfo() {
  const context = useContext(NodeInfoContext);
  if (!context) {
    throw new Error("useNodeInfo must be used within a NodeInfoProvider");
  }
  return context;
}
