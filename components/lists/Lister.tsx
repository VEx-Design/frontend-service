"use client";

import { getChild } from "@/components/getChildren";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ViewType } from "../views/View";
import { ScrollArea } from "../ui/scroll-area";

export type Data = { [Key: string]: string };

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
  mutation: () => Promise<Data[] | undefined>;
  modifyData?: (data: Data[]) => Data[];
}

export function Lister(props: ListerProps) {
  const [data, setData] = useState<Data[]>([]);
  const [modifyData, setModifyData] = useState<Data[]>([]);
  const [currentView, setView] = useState<ViewType>("card");
  const [loading, setLoading] = useState<boolean>(true);

  const { mutation, modifyData: modifyDataProp } = props;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await mutation();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mutation]);

  useEffect(() => {
    if (modifyDataProp) {
      setModifyData(modifyDataProp(data));
    } else {
      setModifyData(data);
    }
  }, [data, modifyDataProp]);

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
        data: modifyData,
      }}
    >
      <div className="flex flex-1 flex-col">
        {header}
        {control}
        {content}
      </div>
    </ListerContext.Provider>
  );
}

interface ListerHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function ListerHeader(props: ListerHeaderProps) {
  const control = useMemo(
    () => getChild(props.children, ListerHeaderControl),
    [props.children]
  );

  return (
    <div className="flex flex-none items-center justify-between border-b pb-4">
      <div className="text-H3 font-bold">{props.title}</div>
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
    <div className="flex flex-1 p-2 overflow-y-auto ">
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
  render: (view: {
    data: { [Key: string]: string }[];
    type: ViewType;
  }) => React.ReactNode;
}

export function ListerContentView(props: ListerContentViewProps) {
  const context = useContext(ListerContext);

  if (!context) {
    throw new Error(
      "ListerContentView must be used within a ListerContext.Provider"
    );
  }

  const parentRef = useRef<HTMLDivElement>(null); // Ref to the parent container
  const [parentHeight, setParentHeight] = useState(0); // State to store parent height

  // Update parent height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (parentRef.current) {
        setParentHeight(parentRef.current.offsetHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div ref={parentRef} className="flex flex-1">
      <ScrollArea className="w-full" style={{ height: parentHeight }}>
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
