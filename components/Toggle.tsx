"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getChildren } from "./getChildren";

interface ToggleListContextType {
  selectedName: string;
  setSelectedName: (name: string) => void;
}

const ToggleListContext = createContext<ToggleListContextType | undefined>(
  undefined
);

interface ToggleListProps<T> {
  children: React.ReactNode;
  onToggle: (name: T) => void;
}

export function ToggleList<T>(props: ToggleListProps<T>) {
  const items = useMemo(
    () => getChildren(props.children, ToggleItem),
    [props.children]
  );

  const [selected, setSelected] = useState(
    items.length > 0 ? items[0].props.name : ""
  );

  useEffect(() => {
    props.onToggle(selected);
  }, [props, selected]);

  const setSelectedName = (name: string) => {
    setSelected(name);
  };

  if (!items || items.length <= 0) {
    console.warn("ToggleList: No ToggleItem components provided as children.");
    return null;
  }

  return (
    <ToggleListContext.Provider
      value={{ selectedName: selected, setSelectedName: setSelectedName }}
    >
      <div className="flex gap-1">{items}</div>
    </ToggleListContext.Provider>
  );
}

interface ToggleItemProps {
  name: string;
  children: React.ReactNode;
}

export function ToggleItem(props: ToggleItemProps) {
  const context = useContext(ToggleListContext);

  if (!context) {
    throw new Error(
      "ToggleItem must be used within a ToggleListContext.Provider"
    );
  }

  return (
    <div
      className={`p-1 hover:bg-B1 rounded-md transition delay-75 w-6 h-6 ${
        context.selectedName === props.name ? "bg-B1" : ""
      } cursor-pointer`}
      onClick={() => context.setSelectedName(props.name)}
    >
      {props.children}
    </div>
  );
}
