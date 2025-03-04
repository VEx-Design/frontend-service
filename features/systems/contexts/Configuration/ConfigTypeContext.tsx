"use client";
import { createContext, useContext, useState } from "react";
import { Property, Type } from "../../libs/ClassType/types/Type";
import { FreeSpace } from "../../libs/ClassConfig/types/FreeSpace";
import { Interface } from "../../libs/ClassInterface/types/Interface";
import addProperty from "../../libs/ClassType/addProperty";
import addInterface from "../../libs/ClassType/addInterface";
import editInterface from "../../libs/ClassType/editInterface";
import getInterface from "../../libs/ClassType/getInterface";
import editImage from "../../libs/ClassType/editImage";
import editName from "../../libs/ClassType/editName";
import editDisplayName from "../../libs/ClassType/editDisplayName";
import { useConfig } from "../ProjectWrapper/ConfigContext";

interface ConfigTypeContextValue {
  currentType: Type | undefined;
  setCurrentType: (type: Type | undefined) => void;
  currentConfigFreeS: FreeSpace | undefined;
  setCurrentConfigFreeS: (freeSpace: FreeSpace | undefined) => void;
  typeAction: TypeAction;
}

const ConfigTypeContext = createContext<ConfigTypeContextValue | undefined>(
  undefined
);

interface TypeAction {
  addType: (newType: Type) => void;
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

export const ConfigTypeProvider = ({
  children,
}: ConfigConsoleProviderProps) => {
  const [currentType, setCurrentType] = useState<Type | undefined>(undefined);
  const [currentConfigFreeS, setCurrentConfigFreeS] = useState<
    FreeSpace | undefined
  >(undefined);

  const { configAction } = useConfig();

  const typeAction: TypeAction = {
    addType: (newType: Type) => {
      configAction.addType(newType);
      setCurrentType(newType);
    },
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
    <ConfigTypeContext.Provider
      value={{
        currentType,
        setCurrentType,
        currentConfigFreeS,
        setCurrentConfigFreeS,
        typeAction,
      }}
    >
      {children}
    </ConfigTypeContext.Provider>
  );
};

export function useConfigType() {
  const context = useContext(ConfigTypeContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
