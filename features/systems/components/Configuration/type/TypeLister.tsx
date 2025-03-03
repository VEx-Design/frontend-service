import React, { useMemo, useCallback } from "react";
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
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";

export default function TypeLister() {
  const { config } = useConfig();
  const { setCurrentType, setCurrentConfigFreeS } = useConfigType();

  // Memoized event handlers
  const onClick = useCallback(
    (getData: GetDataType) => {
      const type = config?.types?.find((ty) => ty.id === getData("id"));
      if (type) {
        setCurrentType(type);
        setCurrentConfigFreeS(undefined);
      }
    },
    [config, setCurrentType, setCurrentConfigFreeS]
  );

  const onClickFreespace = useCallback(
    (getData: GetDataType) => {
      const freeSpace = config?.freeSpaces?.find(
        (freeSpace) => freeSpace.id === getData("id")
      );
      if (freeSpace) {
        setCurrentConfigFreeS(freeSpace);
        setCurrentType(undefined);
      }
    },
    [config, setCurrentType, setCurrentConfigFreeS]
  );

  // Memoize display object to avoid unnecessary re-renders
  const display = useMemo<ListerDisplay>(() => ({}), []);

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
              {config?.freeSpaces?.length > 0 && (
                <>
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
            </>
          )}
        />
      </ListerContent>
    </Lister>
  );
}
