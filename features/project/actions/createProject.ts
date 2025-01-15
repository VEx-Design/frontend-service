"use client";

import { ObjectNode } from "@/features/systems/types/object";
import { createProjectData, createProjectSchema } from "../schema/project";
import { client } from "@/lib/service";
import { Edge } from "@xyflow/react";

export default async function createProject(form: createProjectData) {
  const { success, data } = createProjectSchema.safeParse(form);

  const initialFlow: { nodes: ObjectNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  if (!success) {
    throw new Error("Invalid form data");
  }

  try {
    const response = await client.post(
      "project-management-service/project",
      {
        name: data.name,
        description: data.description,
        flow: JSON.stringify(initialFlow),
      },
      {
        withCredentials: true,
      }
    );
    console.log(response);
    return response; // You should return the response to satisfy the mutation
  } catch (error) {
    throw new Error(
      "Failed to create workflow: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
