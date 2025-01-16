"use client";

import Badge, { BadgeVariant } from "@/components/Badge";
import { createContext, useContext, useMemo, useState } from "react";
import { getChild, getChildren } from "../getChildren";
import Image from "next/image";
import React from "react";

type Data = { [key: string]: string };
export type ViewType = "card" | "list" | "normal";

interface ViewContextValue {
  data: Data;
}

export const ViewContext = createContext<ViewContextValue | undefined>(
  undefined
);

export type GetDataType = (key: string) => string;

interface ViewProps {
  data: Data[];
  render: (view: { getData: GetDataType }) => React.ReactNode;
}

export function View(props: ViewProps) {
  if (props.data.length === 0) return <div></div>;
  else {
    return (
      <>
        {props.data.map((dataItem, index) => {
          return React.cloneElement(
            props.render({
              getData: (key: string) => dataItem[key],
            }) as React.ReactElement,
            { key: index, data: dataItem }
          );
        })}
      </>
    );
  }
}

interface ViewItemProps {
  children: React.ReactNode;
  type: ViewType;
  data?: Data;
  onclick?: () => void;
  onDragStart?: (event: React.DragEvent) => void;
}

export function ViewItem(props: ViewItemProps) {
  const [data] = useState(props.data);

  const title = useMemo(
    () => getChild(props.children, ViewTitle),
    [props.children]
  );

  const cover_img = useMemo(
    () => getChild(props.children, ViewCover),
    [props.children]
  );

  const badges = useMemo(
    () => getChildren(props.children, ViewBadge),
    [props.children]
  );

  const contents = useMemo(
    () => getChildren(props.children, ViewContent),
    [props.children]
  );
  if (data !== undefined) {
    return (
      <ViewContext.Provider value={{ data: data }}>
        {(() => {
          switch (props.type) {
            case "card":
              return (
                <div
                  className="w-full h-fit relative rounded-xl hover:cursor-pointer hover:bg-B1 transition"
                  onClick={props.onclick}
                >
                  <div style={{ height: "250px" }}>{cover_img}</div>
                  <div className="absolute top-2 left-2">{badges}</div>
                  <div className="p-2 w-full overflow-hidden flex items-center">
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-sm font-semibold">{title}</span>
                      <div className="text-[10px] flex flex-col justify-between whitespace-nowrap text-gray-400">
                        {contents}
                      </div>
                    </div>
                  </div>
                </div>
              );
            case "list":
              return (
                <div className="flex items-center rounded-md p-2 text-sm hover:bg-B1 cursor-pointer">
                  <div className="flex border-r-2 px-3 flex-1 gap-3 flex-wrap justify-between">
                    {title}
                  </div>
                  {contents.map((element, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-400 border-r-2 px-3 flex-initial w-[150px] truncate hidden sm:block"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              );
            case "normal":
              return (
                <div
                  className="flex items-center rounded-md p-2 text-sm hover:bg-B1 cursor-pointer"
                  onDragStart={props.onDragStart}
                  draggable={!!props.onDragStart}
                >
                  <div className="h-8 w-8">{cover_img}</div>
                  <div className="flex border-r-2 px-3 flex-1 gap-3 flex-wrap justify-between">
                    {title}
                  </div>
                </div>
              );

            default:
              return <div></div>;
          }
        })()}
      </ViewContext.Provider>
    );
  } else {
    return <></>;
  }
}

interface ViewBadgeProps {
  register: string;
  variant?: BadgeVariant;
}

export function ViewBadge(props: ViewBadgeProps) {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("ViewBadge must be used within a ViewContext.Provider");
  }
  console.log(context.data[props.register]);

  return <Badge text={context.data[props.register]} variant={props.variant} />;
}

interface ViewTitleProps {
  register: string;
}

export function ViewTitle(props: ViewTitleProps) {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("ViewTitle must be used within a ViewContext.Provider");
  }

  return (
    <span className="text-sm font-semibold">
      {context.data[props.register]}
    </span>
  );
}

interface ViewCoverProps {
  register: string;
}

export function ViewCover(props: ViewCoverProps) {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("ViewCover must be used within a ViewContext.Provider");
  }

  const placeholderImage = "https://i.sstatic.net/y9DpT.jpg";

  return (
    <Image
      src={
        context.data[props.register]
          ? context.data[props.register] !== ""
            ? context.data[props.register]
            : placeholderImage
          : placeholderImage
      }
      alt=""
      width={0}
      height={0}
      quality={100}
      style={{ objectFit: "cover", width: "100%", height: "100%" }}
    />
  );
}

interface ViewContentProps {
  register: string;
}

export function ViewContent(props: ViewContentProps) {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("ViewContent must be used within a ViewContext.Provider");
  }

  return <span className="truncate">{context.data[props.register]}</span>;
}
