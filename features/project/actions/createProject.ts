"use client";

import { createProjectData, createProjectSchema } from "../schema/project";
import { service } from "@/lib/service";

export default async function createProject(form: createProjectData) {
  const { success, data } = createProjectSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  try {
    const response = await service.post(
      "project-management-service/project",
      data,
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
