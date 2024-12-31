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

type Data = { [Key: string]: string };

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
}

export function Lister(props: ListerProps) {
  const [data, setData] = useState<Data[]>([]);
  const [currentView, setView] = useState<ViewType>("card");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await props.mutation();
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
  }, [props]);

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
        data: data,
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
  children: React.ReactNode;
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
        <div className="flex flex-col justify-center items-center h-full w-full gap-2">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          Loading...
        </div>
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

interface ListerContentViewProps {
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
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
            {props.render({ data: context.data, type: context.currentView })}
          </div>
        )}
        {context.currentView === "list" && (
          <div className="flex flex-col flex-1 gap-3">
            {props.render({ data: context.data, type: context.currentView })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
