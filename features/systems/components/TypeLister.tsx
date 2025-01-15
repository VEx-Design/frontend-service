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
import getTypes from "../actions/getTypes";

export default function TypeLister() {
  const fetchTypesforList = React.useCallback(async () => {
    try {
      const types = await getTypes();
      return types?.map((type) => {
        return {
          id: type.id,
          name: type.name,
          picture: type.picture,
        };
      });
    } catch (error) {
      console.error("Error fetching projects for listing:", error);
    }
  }, []);

  const onDragStart = (event: React.DragEvent, getData: GetDataType) => {
    event.dataTransfer.setData("application/reactflow", getData("id"));
    event.dataTransfer.effectAllowed = "move";
  };

  const display: ListerDisplay = {};

  return (
    <Lister mutation={fetchTypesforList}>
      <ListerHeader title="Type" />
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
                <ViewItem
                  type="normal"
                  onDragStart={(event) => onDragStart(event, getData)}
                >
                  <ViewTitle register="name" />
                  <ViewCover register="image_url" />
                </ViewItem>
              )}
            />
          )}
        />
      </ListerContent>
    </Lister>
  );
}
