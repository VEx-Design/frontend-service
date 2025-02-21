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
  const { setCurrentType, setCurrentConfigFreeS } = useConfig();

  const onClick = (getData: GetDataType) => {
    const type = config.types.find((ty) => ty.id === getData("id"));
    if (type) {
      setCurrentType(type);
      setCurrentConfigFreeS(undefined);
    }
  };

  const onClickFreespace = (getData: GetDataType) => {
    const freeSpace = config.freeSpaces.find(
      (freeSpace) => freeSpace.id === getData("id")
    );
    setCurrentConfigFreeS(freeSpace);
    setCurrentType(undefined);
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
            <>
              <View
                data={data}
                render={({ getData }: { getData: GetDataType }) => (
                  <ViewItem type="normal" onClick={() => onClick(getData)}>
                    <ViewTitle register="name" />
                    <ViewCover register="picture" />
                  </ViewItem>
                )}
              />
              <div className="py-3 border-b mb-2">
                <p className="text-H5 font-bold">Free space</p>
              </div>
              {config.freeSpaces.map((freeSpace) => (
                <View
                  key={freeSpace.id}
                  data={[{ id: freeSpace.id, name: freeSpace.name }]}
                  render={({ getData }) => (
                    <ViewItem
                      type="normal"
                      onClick={() => onClickFreespace(getData)}
                    >
                      <ViewTitle register="name" />
                    </ViewItem>
                  )}
                />
              ))}
            </>
          )}
        />
      </ListerContent>
    </Lister>
  );
}
