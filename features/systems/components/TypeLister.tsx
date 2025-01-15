import React, { useEffect, useState } from "react";

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
  View,
  ViewBadge,
  ViewContent,
  ViewCover,
  ViewItem,
  ViewTitle,
} from "@/components/views/View";
import getTypes, { TypesResponse } from "../actions/getTypes";
export default function TypeLister() {
  const [types, setTypes] = useState<TypesResponse[] | undefined>(undefined);

  async function fetchTypes() {
    try {
      const data = await getTypes();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypesforList() {
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
  }

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
          render={({ data, type }) => (
            <View
              data={data}
              render={() => (
                <ViewItem type={type}>
                  <ViewBadge register="role" />
                  <ViewTitle register="name" />
                  <ViewCover register="image_url" />
                  <ViewContent register="owner" />
                  <ViewContent register="updatedAt" />
                </ViewItem>
              )}
            />
          )}
        />
      </ListerContent>
    </Lister>
  );
}
