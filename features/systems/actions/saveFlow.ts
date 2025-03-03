"use client";

import { client } from "@/lib/service";
import { AppNode } from "../libs/ClassNode/types/AppNode";
import { AppEdge } from "../libs/ClassEdge/types/AppEdge";

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
    return response; // You should return the response to satisfy the mutation
  } catch (error) {
    throw new Error(
      "Failed to create workflow: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
