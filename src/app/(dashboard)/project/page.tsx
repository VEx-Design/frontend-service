"use client";

import axios from "axios";
import Empty from "../_components/Empty";
import Titlebar from "../_components/Titlebar";
import React, { useEffect, useState } from "react";
import CardProject from "../_components/_cards/CardProject";
import ListProject from "../_components/_cards/ListProject";
import { useUser } from "@clerk/nextjs";

interface Project {
  project_name: string;
  owner: string;
  time_recent_access: string;
  image_url: string;
  can_edit: boolean;
}

export default function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"card" | "list">("card");
  const [filterOption, setFilterOption] = useState<
    "All" | "Own by me" | "Own by anyone"
  >("All");
  const [sortOption, setSortOption] = useState<
    "Last Modified" | "Created on" | "A - Z" | "Z - A"
  >("Last Modified");
  const { user } = useUser();

  useEffect(() => {
    axios
      .get(
        "https://e539c140-f075-4734-8b17-2ba9d16399a6.mock.pstmn.io/TestFilter"
      )
      // .get(
      //   "https://5b498350-5464-49d6-b9d9-d53bfac76c8e.mock.pstmn.io/EmptyProject"
      // )
      .then((response) => {
        console.log(response);
        if (response.data && response.data.length > 0) {
          setProjects(response.data);
          // setProjects([]);
        } else {
          setProjects([]);
        }
      })
      .catch((e) => {
        console.log("Error data :", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filterProjects = projects.filter((project) => {
    if (filterOption === "Own by me" && user) {
      return project.owner === `${user.firstName} ${user.lastName}`;
    }
    if (filterOption === "Own by anyone" && user) {
      return project.owner !== `${user.firstName} ${user.lastName}`;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  const sortProjects = (filteredProjects: Project[]) => {
    switch (sortOption) {
      case "Last Modified":
        return [...filteredProjects].sort(
          (a, b) =>
            new Date(b.time_recent_access).getTime() -
            new Date(a.time_recent_access).getTime()
        );
      case "Created on":
        return [...filteredProjects].sort(
          (a, b) =>
            new Date(b.time_recent_access).getTime() -
            new Date(a.time_recent_access).getTime()
        );
      case "A - Z":
        return [...filteredProjects].sort((a, b) =>
          a.project_name.localeCompare(b.project_name)
        );
      case "Z - A":
        return [...filteredProjects].sort((a, b) =>
          b.project_name.localeCompare(a.project_name)
        );
      default:
        return filteredProjects;
    }
  };

  const filteredAndSortedProjects = sortProjects(filterProjects);

  return (
    <div className="flex flex-1 flex-col">
      <Titlebar
        title="Project"
        buttonAction="redirect"
        currentView={view}
        onViewChange={setView}
        onFilterChange={setFilterOption}
        onSortChange={setSortOption}
      />
      <div className="flex-1 h-[calc(100vh-235px)] p-2 overflow-y-auto ">
        {filteredAndSortedProjects.length === 0 ? (
          <Empty />
        ) : view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
            {filteredAndSortedProjects.map((project, index) => (
              <CardProject key={index} {...project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-3">
            {filteredAndSortedProjects.map((project, index) => (
              <ListProject key={index} {...project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
