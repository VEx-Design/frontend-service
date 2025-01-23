import React from "react";

import {
  Lister,
  ListerContent,
  ListerContentEmpty,
  ListerContentLoading,
  ListerContentView,
  ListerDisplay,
  ListerHeader,
} from "@/components/lists/Lister";
import Empty from "@/src/app/(dashboard)/_components/Empty";
import { Loading } from "@/src/components/loading";
import {
  GetDataType,
  View,
  ViewCover,
  ViewItem,
  ViewTitle,
} from "@/components/views/View";
import { ConfigurationContext } from "../Project";

export default function TypeLister() {
  const context = React.useContext(ConfigurationContext);
  if (!context) {
    throw new Error("TypeLister must be used within a ConfigurationContext");
  }

  const fetchTypesforList = React.useCallback(async () => {
    const types = context.types;
    return types?.map((type) => {
      return {
        id: type.id,
        name: type.name,
        picture: type.picture,
      };
    });
  }, [context.types]);

  const onClick = (getData: GetDataType) => {
    const type = context.types?.find((type) => type.id === getData("id"));
    if (type) {
      context.setCurrentType(type);
    }
  };

  const display: ListerDisplay = {};

  return (
    <Lister mutation={fetchTypesforList}>
      <ListerHeader title="Type" size="small" />
      <ListerContent>
        <ListerContentEmpty>
          <Empty />
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
