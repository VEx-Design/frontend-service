import React, { useContext, useEffect } from "react";

import {
  Lister,
  ListerContent,
  ListerContentEmpty,
  ListerContentLoading,
  ListerContentView,
  ListerDisplay,
  ListerHeader,
  ListerHeaderControl,
} from "@/components/lists/Lister";
import { Loading } from "@/src/components/loading";
import {
  GetDataType,
  View,
  ViewCover,
  ViewItem,
  ViewTitle,
} from "@/components/views/View";
import CreateTypeDialog from "./CreateTypeDialog";
import { ProjectContext } from "@/features/systems/contexts/ProjectContext";

export default function TypeLister() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("TypeLister must be used within a ProjectContext");
  }

  type TypeData = {
    id: string;
    name: string;
    picture: string;
  };

  const [types, setTypes] = React.useState<TypeData[]>([]);

  useEffect(() => {
    if (context.config) {
      setTypes(context.config.types);
    }
  }, [context.config]);

  const onClick = (getData: GetDataType) => {
    const type = context.config?.types.find((t) => t.id === getData("id"));
    if (type) {
      context.setCurrentType(type);
    }
  };

  const display: ListerDisplay = {};

  return (
    <Lister data={types} loading={false}>
      <ListerHeader title="Type" size="small">
        <ListerHeaderControl>
          <CreateTypeDialog />
        </ListerHeaderControl>
      </ListerHeader>
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
                <ViewItem type="normal" onClick={() => onClick(getData)}>
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
