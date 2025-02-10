"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useProject } from "./ProjectContext";
import editInterface from "../libs/ClassType/editInterface";
import addInterface from "../libs/ClassType/addInterface";
import addProperty from "../libs/ClassType/addProperty";

// type
import { Property, Type } from "../libs/ClassType/types/Type";
import { Interface } from "../libs/ClassInterface/types/Interface";

interface ConfigContextValue {
  currentType: Type | undefined;
  setCurrentType: (type: Type) => void;
  currentInterface: Interface | undefined;
  setCurrentInterface: (type: Interface) => void;
  typeAction: TypeAction;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface TypeAction {
  addProperty: (newProperty: Property) => void;
  addInterface: () => void;
  editInterface: (interfaceId: string, newInterface: Interface) => void;
}

interface ConfigConsoleProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider = ({ children }: ConfigConsoleProviderProps) => {
  const [currentType, setCurrentType] = useState<Type | undefined>(undefined);
  const [currentInterface, setCurrentInterface] = useState<
    Interface | undefined
  >(undefined);

  const { configAction } = useProject();

  useEffect(() => {
    if (currentType) {
      setCurrentInterface(currentType.interface[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType?.id]);

  const typeAction: TypeAction = {
    addProperty: (newProperty: Property) => {
      if (currentType) {
        setCurrentType(addProperty(currentType, newProperty));
        configAction.editType(addProperty(currentType, newProperty));
      }
    },
    addInterface: () => setCurrentType(addInterface(currentType!)),
    editInterface: (interfaceId: string, newInterface: Interface) => {
      setCurrentType(editInterface(currentType!, interfaceId, newInterface));
      configAction.editType(
        editInterface(currentType!, interfaceId, newInterface)
      );
    },
  };

  return (
    <ConfigContext.Provider
      value={{
        currentType,
        setCurrentType,
        currentInterface,
        setCurrentInterface,
        typeAction,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
