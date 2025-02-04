import React, { useContext, useEffect } from "react";

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
} from "@/components/views/View";
import { ProjectContext } from "../Project";

export default function TypeLister() {
  const projectContext = useContext(ProjectContext);
  if (!projectContext) {
    throw new Error("ProjectContext must be used within an ProjectProvider");
  }
  const { config } = projectContext;

  type TypeData = {
    id: string;
    name: string;
    picture: string;
  };

  const [types, setTypes] = React.useState<TypeData[]>([]);

  useEffect(() => {
    if (config) {
      setTypes(config.types);
    }
  }, [config]);

  const onDragStart = (event: React.DragEvent, getData: GetDataType) => {
    event.dataTransfer.setData("application/reactflow", getData("id"));
    event.dataTransfer.effectAllowed = "move";
  };

  const display: ListerDisplay = {};

  return (
    <Lister data={types} loading={false}>
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
  );
}
