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

export default function InputLightSelector() {
  const { focusNode } = useExecution();
  const { config } = useConfig();
  const interfaces = React.useMemo(
    () => focusNode?.data?.object?.interfaces || [],
    [focusNode]
  );

  const {
    focusInputInterface,
    setFocusInputInterface,
    lightInputList,
    setLightInputList,
    focusInputLight,
    setFocusInputLight,
  } = useNodeInfo();

  // Determine the default interface (first available one)
  const defaultInterface =
    interfaces.length > 0 ? interfaces[0].interfaceId : undefined;
  const defaultLight = lightInputList[0]?.id;

  // Update default value when `focusNode` changes
  useEffect(() => {
    setFocusInputInterface(defaultInterface);
  }, [defaultInterface, setFocusInputInterface]);

  useEffect(() => {
    setFocusInputLight(defaultLight);
  }, [defaultLight, setFocusInputLight]);

  useEffect(() => {
    const inputLights = interfaces.find(
      (interfaceItem) => interfaceItem.interfaceId === focusInputInterface
    )?.input;

    setLightInputList(inputLights || []);
  }, [focusInputInterface, interfaces, setLightInputList]);

  if (!config || interfaces.length === 0) {
    return null; // Prevent rendering if data is missing
  }

  return (
    <div className="flex p-3 border-b gap-2">
      <Select
        value={focusInputInterface}
        onValueChange={setFocusInputInterface}
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

      {lightInputList.length > 0 && (
        <Select value={focusInputLight} onValueChange={setFocusInputLight}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select a light" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Lights</SelectLabel>
              {lightInputList.map((light, index) => {
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
