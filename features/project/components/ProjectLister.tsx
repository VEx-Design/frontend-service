"use client";

import React, { useState } from "react";

import {
  Data,
  Lister,
  ListerContent,
  ListerContentEmpty,
  ListerContentLoading,
  ListerContentView,
  ListerControl,
  ListerControlLeft,
  ListerControlRight,
  ListerHeader,
  ListerHeaderControl,
} from "@/components/lists/Lister";
import Image from "next/image";
import CreateProjectDialog from "@/features/project/components/CreateProjectDialog";
import Dropdown from "@/components/Dropdown";
import ListIcon from "@/public/icons/DisplayCardIcons/ph_list-light.svg";
import CardIcon from "@/public/icons/DisplayCardIcons/ri_gallery-view-2.svg";
import { ToggleItem, ToggleList } from "@/components/Toggle";
import Empty from "@/src/app/(dashboard)/_components/Empty";
import {
  GetDataType,
  View,
  ViewBadge,
  ViewContent,
  ViewCover,
  ViewItem,
  ViewTitle,
} from "@/components/views/View";
import getProject from "../actions/getProjectForUser";
import { Loading } from "@/src/components/loading";
import { sortString } from "@/components/lists/sorting";
import { useUser } from "@/features/auth/provider/AuthProvider";
import { compareString } from "@/components/lists/filter";
import { useRouter } from "next/navigation";

export default function ProjectLister() {
  const { user } = useUser();

  const router = useRouter();

  const itemClick = (getData: GetDataType) => {
    router.push(`/system/editor/${getData("id")}`);
  };

  const [sort, setSort] = useState<(data: Data[]) => Data[]>(
    () => (data: Data[]) => data
  );
  const [filter, setFilter] = useState<(data: Data[]) => Data[]>(
    () => (data: Data[]) => data
  );

  async function fetchProjects() {
    try {
      const data = await getProject();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  const ownerItems = [
    {
      name: "All",
      onClick: () => {},
    },
    {
      name: "Own by me",
      onClick: () => {
        setFilter(
          () => (data: Data[]) => compareString(data, "name", user?.name ?? "")
        );
      },
    },
    {
      name: "Own by anyone",
      onClick: () => {
        setFilter(
          () => (data: Data[]) => compareString(data, "name", user?.name ?? "")
        );
      },
    },
  ];

  const sortItems = [
    {
      name: "Last Modified",
      onClick: () => {},
    },
    {
      name: "Created on",
      onClick: () => {},
    },
    {
      name: "A - Z",
      onClick: () => {
        setSort(() => (data: Data[]) => sortString(data, "name", true));
      },
    },
    {
      name: "Z - A",
      onClick: () => {
        setSort(() => (data: Data[]) => sortString(data, "name", false));
      },
    },
  ];

  return (
    <Lister mutation={fetchProjects} modifyData={(data) => filter(sort(data))}>
      <ListerHeader title="Project">
        <ListerHeaderControl>
          <CreateProjectDialog />
        </ListerHeaderControl>
      </ListerHeader>
      <ListerControl>
        <ListerControlLeft
          render={(setView) => (
            <ToggleList onToggle={setView}>
              <ToggleItem name="card">
                <Image src={CardIcon} alt="CardIcon" />
              </ToggleItem>
              <ToggleItem name="list">
                <Image src={ListIcon} alt="ListIcon" />
              </ToggleItem>
            </ToggleList>
          )}
        ></ListerControlLeft>
        <ListerControlRight
          render={() => (
            <>
              <Dropdown items={ownerItems} />
              <Dropdown items={sortItems} />
            </>
          )}
        ></ListerControlRight>
      </ListerControl>
      <ListerContent>
        <ListerContentEmpty>
          <Empty />
        </ListerContentEmpty>
        <ListerContentLoading>
          <Loading />
        </ListerContentLoading>
        <ListerContentView
          render={({ data, type }) => (
            <View
              data={data}
              render={({ getData }) => (
                <ViewItem type={type} onclick={() => itemClick(getData)}>
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
