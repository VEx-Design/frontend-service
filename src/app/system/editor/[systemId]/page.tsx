import getProjectByID from "@/features/systems/actions/getProjectWithID";
import Project from "@/features/systems/components/Project";
import React from "react";

export default async function Page({
  params,
}: {
  params: { systemId: string };
}) {
  // Await params if necessary (e.g., async route params access)
  const { systemId } = await params;

  // Fetch the project data
  const project = await getProjectByID(systemId);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <Project project={project} />
    </div>
  );
}
