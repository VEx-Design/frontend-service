"use server";

import { client } from "@/lib/service";
import { AuthObject } from "../types/auth";

export default async function auth(): Promise<AuthObject> {
  try {
    const response = await client.post("authorization/id");
    return { userId: response.data.userId };
  } catch {
    return { userId: "" };
  }
}
