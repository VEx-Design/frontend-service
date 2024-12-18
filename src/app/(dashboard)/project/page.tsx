"use client";

import axios from "axios";
import Empty from "../_components/Empty";
import Titlebar from "../_components/Titlebar";
import React, { useEffect, useState } from "react";
import CardProject from "../_components/_cards/CardProject";
import ListProject from "../_components/_cards/ListProject";

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

  useEffect(() => {
    axios
      .get("https://e5a75b3f-3ce0-4fe3-a6c9-6695bd5c6eef.mock.pstmn.io/project")
      // .get(
      //   "https://5b498350-5464-49d6-b9d9-d53bfac76c8e.mock.pstmn.io/EmptyProject"
      // )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setProjects(response.data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <>
      <Titlebar
        title="Project"
        buttonAction="redirect"
        currentView={view}
        onViewChange={setView}
      />
      <div className="flex-1 h-[calc(100vh-235px)] overflow-y-auto ">
        {projects.length === 0 ? (
          <Empty />
        ) : view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 justify-items-center">
            {projects.map((project, index) => (
              <CardProject key={index} {...project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project, index) => (
              <ListProject key={index} {...project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
