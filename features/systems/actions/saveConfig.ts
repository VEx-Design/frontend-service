"use client";

import { client } from "@/lib/service";
import { Config } from "../libs/ClassConfig/types/Config";

export default async function saveConfig(projId: string, config: Config) {
  try {
    const response = await client.put(
      "project-management-service/project/type",
      {
        id: projId,
        typesConfig: JSON.stringify(config),
      },
      {
        withCredentials: true,
      }
    );
    return response; // You should return the response to satisfy the mutation
  } catch (error) {
    throw new Error(
      "Failed to save config: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
