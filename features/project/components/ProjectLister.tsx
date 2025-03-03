"use client";

import React, { useCallback, useEffect, useState } from "react";

import {
  Lister,
  ListerContent,
  ListerContentEmpty,
  ListerContentLoading,
  ListerContentView,
  ListerControl,
  ListerControlLeft,
  ListerControlRight,
  ListerDisplay,
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
} from "@/components/lists/views/View";
import getMyProjects from "../actions/getProjectForUser";
import { Loading } from "@/src/components/loading";
import { sortDate, sortString } from "@/components/lists/sorting";
import { useUser } from "@/features/auth/provider/AuthProvider";
import { compareString } from "@/components/lists/filter";
import { useRouter } from "next/navigation";
import { Data } from "@/components/lists/types/Data";

export default function ProjectLister() {
  const [projects, setProjects] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    setLoading(true);
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const setSortFunction = useCallback((fn: (data: Data[]) => Data[]) => {
    setSort(() => fn);
  }, []);

  const setFilterFunction = useCallback((fn: (data: Data[]) => Data[]) => {
    setFilter(() => fn);
  }, []);

  const ownerItems = [
    {
      name: "All",
      onClick: () => setFilterFunction((data) => data),
    },
    {
      name: "Owned by me",
      onClick: () =>
        setFilterFunction((data) =>
          compareString(data, "owner", user?.name ?? "")
        ),
    },
    {
      name: "Owned by anyone",
      onClick: () => setFilterFunction((data) => data),
    },
  ];

  const sortItems = [
    {
      name: "Last Modified",
      onClick: () =>
        setSortFunction((data) => sortDate(data, "updatedTime", false)),
    },
    {
      name: "Created on",
      onClick: () =>
        setSortFunction((data) => sortDate(data, "createdTime", false)),
    },
    {
      name: "A - Z",
      onClick: () => setSortFunction((data) => sortString(data, "name", true)),
    },
    {
      name: "Z - A",
      onClick: () => setSortFunction((data) => sortString(data, "name", false)),
    },
  ];

  const display: ListerDisplay = {
    card: "w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center",
    list: "flex flex-col flex-1 gap-3",
  };

  return (
    <Lister
      data={projects}
      loading={loading}
      sortFunction={sort}
      filterFunction={filter}
    >
      <ListerHeader title="Project">
        <ListerHeaderControl>
          <CreateProjectDialog onCreated={fetchProjects} />
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
          listDisplay={display}
          render={({ data, type }) => (
            <View
              data={data}
              render={({ getData }) => (
                <ViewItem type={type} onClick={() => itemClick(getData)}>
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
