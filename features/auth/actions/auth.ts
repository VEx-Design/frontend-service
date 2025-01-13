"use server";

import { AuthObject } from "../types/auth";
import { cookies } from "next/headers";
import { client } from "@/lib/service";

export default async function auth(): Promise<AuthObject> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("Authorization");

  if (!sessionCookie) {
    console.warn("Authorization cookie is missing.");
    return { userId: "" };
  }

  try {
    const response = await client.post<{ userId: string }>(
      "authorization/id",
      null, // Use `null` for POST requests with no body
      {
        headers: {
          cookie: `Authorization=${sessionCookie.value}`,
        },
      }
    );

    return { userId: response.data.userId };
  } catch (error) {
    console.error("Error during authorization:", error);
    return { userId: "" };
  }
}
