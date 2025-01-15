"use client";

import { client } from "@/lib/service";
import { Edge } from "@xyflow/react";
import { AppNode } from "../types/appNode";

export default async function saveFlow(
  projId: string,
  flow: { nodes: AppNode[]; edges: Edge[] }
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
