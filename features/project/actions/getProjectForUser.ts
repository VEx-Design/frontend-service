"use client";

import { service } from "@/lib/service";

export default async function getProject(): Promise<
  { [key: string]: string }[]
> {
  try {
    const response = await service.get(
      "https://e539c140-f075-4734-8b17-2ba9d16399a6.mock.pstmn.io/TestFilter"
    );
    return response.data; // Assuming `response.data` contains the array of projects.
  } catch (error) {
    if (error instanceof Error) {
      // Handle known error type
      throw new Error(`Failed to get workflow: ${error.message}`);
    } else {
      // Handle unexpected error type
      throw new Error("Failed to get workflow: An unknown error occurred.");
    }
  }
}
