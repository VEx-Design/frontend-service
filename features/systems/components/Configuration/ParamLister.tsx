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
  ViewItem,
  ViewTitle,
} from "@/components/views/View";

export default function ParamLister() {
  const fetchTypesforList = React.useCallback(async () => {
    return [
      {
        id: "1",
        display: "Beam radius [r]",
        name: "Beam radius",
        symbol: "r",
      },
      {
        id: "2",
        display: "Beam angles [θ]",
        name: "Beam angles",
        symbol: "θ",
      },
      // {
      //   id: "3",
      //   name: "Field vector X",
      //   symbol: "Ex",
      // },
      // {
      //   id: "4",
      //   name: "Field vector Y",
      //   symbol: "Ey",
      // },
    ];
  }, []);

  const onDragStart = (event: React.DragEvent, getData: GetDataType) => {
    event.dataTransfer.setData("application/reactflow", getData("id"));
    event.dataTransfer.effectAllowed = "move";
  };

  const display: ListerDisplay = {};

  return (
    <Lister mutation={fetchTypesforList}>
      <ListerHeader title="Parameter" size="small" />
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
                  <ViewTitle register="display" />
                </ViewItem>
              )}
            />
          )}
        />
      </ListerContent>
    </Lister>
  );
}
