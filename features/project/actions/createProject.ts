"use client";

import { AppNode } from "@/features/systems/libs/ClassNode/types/AppNode";
import { createProjectData, createProjectSchema } from "../schema/project";
import { client } from "@/lib/service";
import parameterConfig from "@/features/systems/libs/standard/parameter.json";
import parameterGroupConfig from "@/features/systems/libs/standard/parameterGroup.json";
import { AppEdge } from "@/features/systems/libs/ClassEdge/types/AppEdge";
import { Config } from "@/features/systems/libs/ClassConfig/types/Config";

// type of optical
import typePCL from "@/features/systems/libs/standard/type/PCL.json";
import typePXL from "@/features/systems/libs/standard/type/PXL.json";
import typePBS from "@/features/systems/libs/standard/type/PBS.json";
import typeLP from "@/features/systems/libs/standard/type/LP.json";
import typeHWP from "@/features/systems/libs/standard/type/HWP.json";
import typeQWP from "@/features/systems/libs/standard/type/QWP.json";

export default async function createProject(form: createProjectData) {
  const { success, data } = createProjectSchema.safeParse(form);
  // Update the initial flow with some errror
  const initialFlow: { nodes: AppNode[]; edges: AppEdge[] } = {
    nodes: [],
    edges: [],
  };

  const config: Config = {
    types: [
      JSON.parse(JSON.stringify(typePCL)),
      JSON.parse(JSON.stringify(typePXL)),
      JSON.parse(JSON.stringify(typePBS)),
      JSON.parse(JSON.stringify(typeLP)),
      JSON.parse(JSON.stringify(typeHWP)),
      JSON.parse(JSON.stringify(typeQWP)),
    ],
    // types: [],
    ...parameterConfig,
    ...parameterGroupConfig,
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
