"use client";

import {client} from '@/lib/service'
import { BoundingConfiguration } from '../libs/ClassBox/types/BoundingConfiguration'

export default async function saveBounding(projId: string, mapBounding: Map<string, BoundingConfiguration>) {
  try {
      const response = await client.put(
        "project-management-service/project/bounding",
        {
          id: projId,
          boudingConfig: JSON.stringify(mapBounding),
        },
        {
          withCredentials: true,
        }
      );
      return response; // You should return the response to satisfy the mutation
    } catch (error) {
      throw new Error(
        "Failed to save bounding: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
}
