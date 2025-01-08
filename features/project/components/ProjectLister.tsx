import React from "react";

import {
  Lister,
  ListerContent,
  ListerContentEmpty,
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
  View,
  ViewBadge,
  ViewContent,
  ViewCover,
  ViewItem,
  ViewTitle,
} from "@/components/views/View";
import getProject from "../actions/getProjectForUser";

const ownerItems = [
  {
    name: "All",
    onClick: () => {},
  },
  {
    name: "Own by me",
    onClick: () => {},
  },
  {
    name: "Own by anyone",
    onClick: () => {},
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
    onClick: () => {},
  },
  {
    name: "Z - A",
    onClick: () => {},
  },
];

export default function ProjectLister() {
  async function fetchProjects() {
    try {
      const data = await getProject();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  return (
    <Lister mutation={fetchProjects}>
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
        <ListerContentView
          render={({ data, type }) => (
            <View data={data}>
              <ViewItem type={type}>
                <ViewBadge register="owner" />
                <ViewTitle register="project_name" />
                <ViewCover register="image_url" />
                <ViewContent register="owner" />
                <ViewContent register="time_recent_access" />
              </ViewItem>
            </View>
          )}
        ></ListerContentView>
      </ListerContent>
    </Lister>
  );
}
