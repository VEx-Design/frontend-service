import React from "react";

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
} from "@/components/lists/views/View";
import CreateTypeDialog from "./CreateTypeDialog";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { useConfig } from "@/features/systems/contexts/ConfigContext";

export default function TypeLister() {
  const { config } = useProject();
  const { setCurrentType } = useConfig();

  const onClick = (getData: GetDataType) => {
    const type = config.types.find((ty) => ty.id === getData("id"));
    if (type) {
      setCurrentType(type);
    }
  };

  const display: ListerDisplay = {};

  return (
    <Lister data={config.types} loading={false}>
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
              render={({ getData }: { getData: GetDataType }) => (
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
