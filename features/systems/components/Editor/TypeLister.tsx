import React from "react";

import { useProject } from "../../contexts/ProjectContext";

import {
  Lister,
  ListerContent,
  ListerContentEmpty,
  ListerContentLoading,
  ListerContentView,
  ListerDisplay,
  ListerHeader,
} from "@/components/lists/Lister";
import { Loading } from "@/src/components/loading";
import {
  GetDataType,
  View,
  ViewCover,
  ViewItem,
  ViewTitle,
} from "@/components/lists/views/View";

export default function TypeLister() {
  const { config } = useProject();

  const onDragStart = (event: React.DragEvent, getData: GetDataType) => {
    event.dataTransfer.setData("application/reactflow", String(getData("id")));
    event.dataTransfer.effectAllowed = "move";
  };

  const display: ListerDisplay = {};

  return (
    <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 px-3 overflow-y-auto">
      <Lister data={config.types} loading={false}>
        <ListerHeader title="Type" size="small" />
        <ListerContent>
          <ListerContentEmpty>
            <p className="p-3 text-sm text-gray-500 text-center">
              Your project type is empty. Start by creating a new type
            </p>
          </ListerContentEmpty>
          <ListerContentLoading>
            <Loading />
          </ListerContentLoading>
          <ListerContentView
            listDisplay={display}
            render={({ data }) => (
              <View
                data={data}
                render={({ getData }) => (
                  <ViewItem
                    type="normal"
                    onDragStart={(event) => onDragStart(event, getData)}
                  >
                    <ViewTitle register="name" />
                    <ViewCover register="picture" />
                  </ViewItem>
                )}
              />
            )}
          />
        </ListerContent>
      </Lister>
    </div>
  );
}
