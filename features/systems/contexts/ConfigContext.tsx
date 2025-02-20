"use client";
import { createContext, useContext, useState } from "react";
import { useProject } from "./ProjectContext";
import editInterface from "../libs/ClassType/editInterface";
import addInterface from "../libs/ClassType/addInterface";
import addProperty from "../libs/ClassType/addProperty";

// type
import { Property, Type } from "../libs/ClassType/types/Type";
import { Interface } from "../libs/ClassInterface/types/Interface";
import getInterface from "../libs/ClassType/getInterface";
import editImage from "../libs/ClassType/editImage";
import editName from "../libs/ClassType/editName";
import editDisplayName from "../libs/ClassType/editDisplayName";

interface ConfigContextValue {
  currentType: Type | undefined;
  setCurrentType: (type: Type | undefined) => void;
  isConfigFreeS: boolean;
  setIsConfigFreeS: (isConfig: boolean) => void;
  typeAction: TypeAction;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface TypeAction {
  addProperty: (newProperty: Property) => void;
  addInterface: () => Interface;
  setInterface: (interfaceId: string, newInterface: Interface) => void;
  updateInterface: (interfaceId: string, newInterface: Interface) => void;
  getProperty: (propertyId: string) => Property | undefined;
  getInterface: (interfaceId: string) => Interface | undefined;
  editImage: (fileName: string) => void;
  editName: (name: string) => void;
  editDisplayName: (displayName: string) => void;
}

interface ConfigConsoleProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider = ({ children }: ConfigConsoleProviderProps) => {
  const [currentType, setCurrentType] = useState<Type | undefined>(undefined);
  const [isConfigFreeS, setIsConfigFreeS] = useState<boolean>(false);

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
      return newType.interfaces[newType.interfaces.length - 1];
    },
    setInterface: (interfaceId: string, newInterface: Interface) => {
      const newType = editInterface(currentType!, interfaceId, newInterface);
      setCurrentType(newType);
      configAction.editType(newType);
    },
    updateInterface: (interfaceId: string, newInterface: Interface) => {
      const newType = editInterface(currentType!, interfaceId, newInterface);
      configAction.editType(newType);
    },
    getProperty: (propertyId: string) => {
      return currentType?.properties.find(
        (property) => property.id === propertyId
      );
    },
    getInterface: (interfaceId: string) => {
      return getInterface(currentType!, interfaceId);
    },
    editImage: (fileName: string) => {
      if (currentType) {
        const newType = editImage(currentType, fileName);
        setCurrentType(newType);
        configAction.editType(newType);
      }
    },
    editName: (name: string) => {
      if (currentType) {
        const newType = editName(currentType, name);
        setCurrentType(newType);
        configAction.editType(newType);
      }
    },
    editDisplayName: (displayName: string) => {
      if (currentType) {
        const newType = editDisplayName(currentType, displayName);
        setCurrentType(newType);
        configAction.editType(newType);
      }
    },
  };

  return (
    <ConfigContext.Provider
      value={{
        currentType,
        setCurrentType,
        isConfigFreeS,
        setIsConfigFreeS,
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
