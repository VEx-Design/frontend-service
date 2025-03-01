"use client";

import { AppNode } from "@/features/systems/libs/ClassNode/types/AppNode";
import { createProjectData, createProjectSchema } from "../schema/project";
import { client } from "@/lib/service";
import { Config } from "@/features/systems/libs/ClassConfig/types/Config";
import { AppEdge } from "@/features/systems/libs/ClassEdge/types/AppEdge";

export default async function createProject(form: createProjectData) {
  const { success, data } = createProjectSchema.safeParse(form);

  const initialFlow: { nodes: AppNode[]; edges: AppEdge[] } = {
    nodes: [],
    edges: [],
  };

  const config: Config = {
    types: [],
    parameters: [],
    parameterGroups: [],
    freeSpaces: [{ id: crypto.randomUUID(), name: "Regular", formulas: [] }],
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
        typesConfig: JSON.stringify(config),
        configurationID: 1,
      },
      {
        withCredentials: true,
      }
    );
    return response; // You should return the response to satisfy the mutation
  } catch (error) {
    throw new Error(
      "Failed to create workflow: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
