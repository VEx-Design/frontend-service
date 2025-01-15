import getProjectByID from "@/features/systems/actions/getProjectWithID";
import Editor from "@/features/systems/components/Editor";
import EditorNavbar from "@/features/systems/components/Editor/EditorNavbar";
import { ReactFlowProvider } from "@xyflow/react";
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

  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <EditorNavbar title={project?.name} />
      <ReactFlowProvider>
        <Editor />
      </ReactFlowProvider>
    </div>
  );
}
