"use client";

import { createProjectData, createProjectSchema } from "../schema/project";
import { service } from "@/lib/service";

export default async function createProject(form: createProjectData) {
  const { success, data } = createProjectSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  } else {
    service
      .post("/api/v1/project", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        throw new Error("failed to create workflow", error);
      });
  }
}
