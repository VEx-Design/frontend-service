import getProjectByID from "@/features/systems/actions/getProjectWithID";
import { ProjectProvider } from "@/features/systems/contexts/ProjectContext";
import Project from "@/features/systems/pages/main/Project";
import React from "react";

export default async function Page({
  params,
}: {
  params: { projectId: string };
}) {
  // Await params if necessary (e.g., async route params access)
  const { projectId } = await params;

  console.log("projectId", projectId);

  // Fetch the project data
  const project = await getProjectByID(projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <ProjectProvider project={project}>
        <Project />
      </ProjectProvider>
    </div>
  );
}
