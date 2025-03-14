import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import getInterfaceInfo from "@/features/systems/libs/ClassInterface/getInterfaceInfo";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useNodeInfo } from "@/features/systems/contexts/Execution/NodeInfoContext";

export default function OutputLightSelector() {
  const { focusNode } = useExecution();
  const { config } = useConfig();
  const interfaces = React.useMemo(
    () => focusNode?.data?.object?.interfaces || [],
    [focusNode]
  );

  const {
    focusOutputInterface,
    setFocusOutputInterface,
    lightOutputList,
    setLightOutputList,
    focusOutputLight,
    setFocusOutputLight,
  } = useNodeInfo();

  // Determine the default interface (first available one)
  const { defaultInterface, defaultLight } = React.useMemo(() => {
    const haveLightInterface = interfaces.filter(
      (interfaceItem) => interfaceItem.output.length > 0
    );
    const nullInterface = interfaces.filter(
      (interfaceItem) => interfaceItem.output.length === 0
    );
    const sortedInterfaces = [...haveLightInterface, ...nullInterface];
    return {
      defaultInterface:
        sortedInterfaces.length > 0
          ? sortedInterfaces[0].interfaceId
          : undefined,
      defaultLight: lightOutputList[0]?.id,
    };
  }, [interfaces, lightOutputList]);

  // Update default value when `focusNode` changes
  useEffect(() => {
    setFocusOutputInterface(defaultInterface);
  }, [defaultInterface, setFocusOutputInterface]);

  useEffect(() => {
    setFocusOutputLight(defaultLight);
  }, [defaultLight, setFocusOutputLight]);

  useEffect(() => {
    const outputLights = interfaces.find(
      (interfaceItem) => interfaceItem.interfaceId === focusOutputInterface
    )?.output;

    setLightOutputList(outputLights || []);
  }, [focusOutputInterface, interfaces, setLightOutputList]);

  if (!config || interfaces.length === 0) {
    return null; // Prevent rendering if data is missing
  }

  return (
    <div className="flex p-3 border-b gap-2">
      <Select
        value={focusOutputInterface}
        onValueChange={setFocusOutputInterface}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an interface" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Interfaces</SelectLabel>
            {interfaces.map((interfaceItem) => {
              const interfaceInfo = getInterfaceInfo(
                config,
                interfaceItem.interfaceId
              );
              if (!interfaceInfo) return null; // Skip if not found

              return (
                <SelectItem
                  key={interfaceItem.interfaceId}
                  value={interfaceItem.interfaceId}
                >
                  {interfaceInfo.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {lightOutputList.length > 0 && (
        <Select value={focusOutputLight} onValueChange={setFocusOutputLight}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select a light" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Lights</SelectLabel>
              {lightOutputList.map((light, index) => {
                return (
                  <SelectItem key={light.id} value={light.id}>
                    {`Light ${index + 1}`}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
