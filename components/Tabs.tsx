import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { getChild, getChildren } from "./libs/getChildren";
import { cn } from "@/lib/utils";

type TabType = "side" | "top";

interface TabsContextType {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  tabType: TabType;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  type: TabType;
}

export function Tabs(props: TabsProps) {
  const [currentTab, setCurrentTab] = useState<string>("Flow");
  const [tabList, setTabList] = useState<{
    [key: string]: React.ReactNode;
  } | null>(null);

  const tabBar = useMemo(() => {
    return getChild(props.children, TabsList);
  }, [props.children]);

  const tabContents = useMemo(() => {
    return getChildren(props.children, TabsContent);
  }, [props.children]);

  useEffect(() => {
    // Set the default tab to the first tab if currentTab is not set
    if (!currentTab && tabContents.length > 0) {
      const firstTab = tabContents[0].props.name;
      if (firstTab) setCurrentTab(firstTab);
    }

    const tabs: { [key: string]: React.ReactNode } = {};
    tabContents.forEach((content) => {
      tabs[content.props.name] = content;
    });
    setTabList(tabs);
  }, [tabContents, currentTab]);

  return (
    <TabsContext.Provider
      value={{ currentTab, setCurrentTab, tabType: props.type }}
    >
      <div
        className={cn(
          "flex",
          props.type === "side" ? "flex h-full" : "flex flex-col h-full"
        )}
      >
        {/* Tab bar rendering */}
        <div>{tabBar}</div>
        {/* Render all tab contents but control their visibility */}
        <div className="flex flex-1">
          {tabList &&
            Object.keys(tabList).map((tabName) => (
              <div
                className="flex flex-1"
                key={tabName}
                style={{
                  display: currentTab === tabName ? "" : "none",
                }}
              >
                {tabList[tabName]}
              </div>
            ))}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
}

export function TabsList(props: TabsListProps) {
  const context = useContext(TabsContext);

  const TabsTriggers = useMemo(
    () => getChildren(props.children, TabsTrigger),
    [props.children]
  );
  if (context?.tabType === "top") {
    return (
      <div className="flex flex-1 bg-gray-100">
        {TabsTriggers.map((trigger, index) => (
          <div key={index}>{trigger}</div>
        ))}
      </div>
    );
  } else if (context?.tabType === "side") {
    return (
      <div className="flex flex-1 flex-col bg-white h-full border-e">
        {TabsTriggers.map((trigger, index) => (
          <div key={index}>{trigger}</div>
        ))}
      </div>
    );
  } else {
    return <div>please select type of the tab</div>;
  }
}

interface TabsTriggerContextType {
  isActive: boolean;
}

const TabsTriggerContext = createContext<TabsTriggerContextType | undefined>(
  undefined
);

interface TabsTriggerProps {
  name: string;
  children?: React.ReactNode;
}

export function TabsTrigger(props: TabsTriggerProps) {
  const context = useContext(TabsContext);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(context?.currentTab === props.name);
  }, [context?.currentTab, props.name]);

  const icon = useMemo(
    () => getChild(props.children, TabsTriggerIcon),
    [props.children]
  );

  if (context?.tabType === "top") {
    return (
      <TabsTriggerContext.Provider value={{ isActive }}>
        <div onClick={() => context?.setCurrentTab(props.name)}>
          {icon ? (
            <div
              className={`flex pe-3 ps-2 rounded-t-lg border border-b-0 cursor-pointer ${
                isActive ? "bg-white" : "bg-gray-100"
              }`}
            >
              {icon}
              <p className="font-thin">{props.name}</p>
            </div>
          ) : (
            <div
              className={`flex px-4 rounded-t-lg border border-b-0 cursor-pointer ${
                isActive ? "bg-white" : "bg-gray-100"
              }`}
            >
              <p className="font-thin">{props.name}</p>
            </div>
          )}
        </div>
      </TabsTriggerContext.Provider>
    );
  } else if (context?.tabType === "side") {
    return (
      <TabsTriggerContext.Provider value={{ isActive }}>
        <div
          className={cn(
            "p-4 cursor-pointer border-s-2",
            isActive && "border-black"
          )}
          onClick={() => context?.setCurrentTab(props.name)}
        >
          {icon}
        </div>
      </TabsTriggerContext.Provider>
    );
  }
}

interface TabsTriggerIconProps {
  children: React.ReactNode;
}

export function TabsTriggerIcon(props: TabsTriggerIconProps) {
  const contextTab = useContext(TabsContext);
  const contextTrigger = useContext(TabsTriggerContext);

  if (contextTab?.tabType === "top") {
    return <div className="w-full h-full scale-[0.75]">{props.children}</div>;
  } else if (contextTab?.tabType === "side") {
    return (
      <div className="w-full h-full">
        {React.isValidElement(props.children) &&
          React.cloneElement(props.children as React.ReactElement, {
            className: cn(
              "hover:text-black",
              contextTrigger?.isActive ? "text-black" : "text-gray-500"
            ),
            size: 32,
          })}
      </div>
    );
  }

  return null;
}

interface TabsContentProps {
  name: string;
  children: React.ReactNode;
}

export function TabsContent(props: TabsContentProps) {
  return <div className="flex flex-1">{props.children}</div>;
}
