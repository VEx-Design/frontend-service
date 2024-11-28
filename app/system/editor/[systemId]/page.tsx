import Editor from "@/features/systems/components/Editor";
import React from "react";

async function page({ params }: { params: { workflowId: string } }) {
  const workflow = {};

  if (!workflow) {
    return <div>workflow not found</div>;
  }

  return <Editor workflow={workflow} />;
}

export default page;
