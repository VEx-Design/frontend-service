"use client";

import { getChild } from "@/components/libs/getChildren";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useResizeDetector } from "react-resize-detector";
import { cn } from "@/lib/utils";

// type
import { Data } from "./types/Data";
import { ViewType } from "./views/View";

interface ListerContextValue {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  loading: boolean;
  data: Data[];
}

export const ListerContext = createContext<ListerContextValue | undefined>(
  undefined
);

interface ListerProps {
  children: React.ReactNode;
  data: Data[];
  loading: boolean;
  sortFunction?: (data: Data[]) => Data[];
  filterFunction?: (data: Data[]) => Data[];
}

export function Lister(props: ListerProps) {
  const { data, loading, sortFunction, filterFunction } = props;

  const [modifyData, setModifyData] = useState<Data[]>(data);
  const [currentView, setView] = useState<ViewType>("card");

  useEffect(() => {
    setModifyData(
      (filterFunction ? filterFunction : (data: Data[]) => data)(
        (sortFunction ? sortFunction : (data: Data[]) => data)(data)
      )
    );
  }, [data, sortFunction, filterFunction]);

  const header = useMemo(
    () => getChild(props.children, ListerHeader),
    [props.children]
  );

  const control = useMemo(
    () => getChild(props.children, ListerControl),
    [props.children]
  );

  const content = useMemo(
    () => getChild(props.children, ListerContent),
    [props.children]
  );

  return (
    <ListerContext.Provider
      value={{
        currentView: currentView,
        setView: setView,
        loading: loading,
        data: modifyData || [],
      }}
    >
      <div className="flex flex-col h-full w-full">
        {header}
        {control}
        {content}
      </div>
    </ListerContext.Provider>
  );
}

const headerSize = {
  big: "text-H3 font-bold",
  small: "text-H4 font-bold",
};

interface ListerHeaderProps {
  title: string;
  children?: React.ReactNode;
  size?: "big" | "small";
}

export function ListerHeader(props: ListerHeaderProps) {
  const control = useMemo(
    () => getChild(props.children, ListerHeaderControl),
    [props.children]
  );

  return (
    <div className="flex flex-none items-center justify-between border-b pb-4">
      <div className={cn(headerSize[props.size || "big"])}>{props.title}</div>
      {control}
    </div>
  );
}

export function ListerHeaderControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-row gap-2">{children}</div>;
}

interface ListerControlProps {
  children: React.ReactNode;
}

export function ListerControl(props: ListerControlProps) {
  const left = useMemo(
    () => getChild(props.children, ListerControlLeft),
    [props.children]
  );

  const right = useMemo(
    () => getChild(props.children, ListerControlRight),
    [props.children]
  );

  const context = useContext(ListerContext);

  if (!context) {
    throw new Error(
      "ListerControl must be used within a ListerContext.Provider"
    );
  }

  return (
    <div className="flex flex-none items-end sm:items-center justify-between py-4 flex-col sm:flex-row">
      {left}
      {right}
    </div>
  );
}

type ListerControl = (setView: (name: ViewType) => void) => React.ReactNode;

interface ListerControlLeftProps {
  render: ListerControl;
}

export function ListerControlLeft(props: ListerControlLeftProps) {
  const context = useContext(ListerContext);

  if (!context) {
    throw new Error(
      "ListerControlLeft must be used within a ListerContext.Provider"
    );
  }

  return <div className="flex gap-4">{props.render(context.setView)}</div>;
}

interface ListerControlRightProps {
  render: ListerControl;
}

export function ListerControlRight(props: ListerControlRightProps) {
  const context = useContext(ListerContext);

  if (!context) {
    throw new Error(
      "ListerControlLeft must be used within a ListerContext.Provider"
    );
  }

  return <div className="flex gap-4">{props.render(context.setView)}</div>;
}

interface ListerContentProps {
  children: React.ReactNode;
}

export function ListerContent(props: ListerContentProps) {
  const empty = useMemo(
    () => getChild(props.children, ListerContentEmpty),
    [props.children]
  );

  const loading = useMemo(
    () => getChild(props.children, ListerContentLoading),
    [props.children]
  );

  const view = useMemo(
    () => getChild(props.children, ListerContentView),
    [props.children]
  );

  const context = useContext(ListerContext);

  if (!context) {
    throw new Error(
      "ListerContent must be used within a ListerContext.Provider"
    );
  }

  return (
    <div className="flex h-full w-full p-2">
      {context.loading ? (
        loading
      ) : context.data.length === 0 ? (
        empty
      ) : (
        <div className="flex flex-1">{view}</div>
      )}
    </div>
  );
}

interface ListerContentEmptyProps {
  children: React.ReactNode;
}

export function ListerContentEmpty(props: ListerContentEmptyProps) {
  return <div className="flex flex-1">{props.children}</div>;
}

interface ListerContentLoadingProps {
  children: React.ReactNode;
}

export function ListerContentLoading(props: ListerContentLoadingProps) {
  return <div className="flex flex-1">{props.children}</div>;
}

export type ListerDisplay = { [key in ViewType]?: string };

interface ListerContentViewProps {
  listDisplay: ListerDisplay;
  render: (view: { data: Data[]; type: ViewType }) => React.ReactNode;
}

export function ListerContentView(props: ListerContentViewProps) {
  const context = useContext(ListerContext);

  if (!context) {
    throw new Error(
      "ListerContentView must be used within a ListerContext.Provider"
    );
  }

  const { ref, height } = useResizeDetector();
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    if (height) {
      setParentHeight(height); // Update height automatically
    }
  }, [height]);

  return (
    <div ref={ref} className="flex flex-1">
      <ScrollArea className="w-full" style={{ height: parentHeight - 15 }}>
        {context.currentView === "card" && (
          <div className={props.listDisplay.card || ""}>
            {props.render({
              data: context.data,
              type: context.currentView,
            })}
          </div>
        )}
        {context.currentView === "list" && (
          <div className={props.listDisplay.list || ""}>
            {props.render({
              data: context.data,
              type: context.currentView,
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
