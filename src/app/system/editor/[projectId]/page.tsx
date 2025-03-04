import getProjectByID from "@/features/systems/actions/getProjectWithID";
import { ProjectProvider } from "@/features/systems/contexts/ProjectContext";
import { ConfigProvider } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { EdgesProvider } from "@/features/systems/contexts/ProjectWrapper/EdgesContext";
import { NodesProvider } from "@/features/systems/contexts/ProjectWrapper/NodesContext";
import Project from "@/features/systems/pages/main/Project";
import { notFound } from "next/navigation"; // Import notFound from next/navigation
import React from "react";

export default async function Page({
  params,
}: {
  params: { projectId: string };
}) {
  // Await params if necessary (e.g., async route params access)
  const { projectId } = await params;

  // Fetch the project data
  const project = await getProjectByID(projectId);

  // If the project is not found, trigger the 404 page
  if (!project) {
    notFound(); // This redirects to the 404 page
    return null; // This ensures the component doesn't continue rendering
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <ConfigProvider project={project}>
        <NodesProvider>
          <EdgesProvider>
            <ProjectProvider project={project}>
              <Project />
            </ProjectProvider>
          </EdgesProvider>
        </NodesProvider>
      </ConfigProvider>
    </div>
  );
}
