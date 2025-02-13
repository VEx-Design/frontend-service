"use client";
import { createContext, useContext, useState } from "react";
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
  typeAction: TypeAction;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface TypeAction {
  addProperty: (newProperty: Property) => void;
  addInterface: () => void;
  setInterface: (interfaceId: string, newInterface: Interface) => void;
  getProperty: (propertyId: string) => Property | undefined;
  getInterface: (interfaceId: string) => Interface | undefined;
}

interface ConfigConsoleProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider = ({ children }: ConfigConsoleProviderProps) => {
  const [currentType, setCurrentType] = useState<Type | undefined>(undefined);

  const { configAction } = useProject();

  const typeAction: TypeAction = {
    addProperty: (newProperty: Property) => {
      if (currentType) {
        const newType = addProperty(currentType, newProperty);
        setCurrentType(newType);
        configAction.editType(newType);
      }
    },
    addInterface: () => {
      const newType = addInterface(currentType!);
      setCurrentType(newType);
      configAction.editType(newType);
    },
    setInterface: (interfaceId: string, newInterface: Interface) => {
      const newType = editInterface(currentType!, interfaceId, newInterface);
      setCurrentType(newType);
      configAction.editType(newType);
    },
    getProperty: (propertyId: string) => {
      return currentType?.properties.find(
        (property) => property.id === propertyId
      );
    },
    getInterface: (interfaceId: string) => {
      return currentType?.interfaces.find((inter) => inter.id === interfaceId);
    },
  };

  return (
    <ConfigContext.Provider
      value={{
        currentType,
        setCurrentType,
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
