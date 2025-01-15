"use client";

import { client } from "@/lib/service";
import { AppNode } from "../types/appNode";
import { AppEdge } from "../types/appEdge";

export default async function saveFlow(
  projId: string,
  flow: { nodes: AppNode[]; edges: AppEdge[] }
) {
  try {
    const response = await client.put(
      "project-management-service/project/flow",
      {
        id: projId,
        flow: JSON.stringify(flow),
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
