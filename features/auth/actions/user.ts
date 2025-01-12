"use server";

import { cookies } from "next/headers";
import { User } from "../types/user";
import { gql, GraphQLClient } from "graphql-request";

const GET_USER = gql`
  {
    user {
      id
      name
      email
      picture
    }
  }
`;

export default async function currentUser(): Promise<User | undefined> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("Authorization");

  try {
    // Initialize the GraphQL client with credentials
    const client = new GraphQLClient(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/user-info-service/query`,
      {
        headers: {
          cookie: `Authorization=${sessionCookie?.value ?? ""}`,
        },
      }
    );

    // Make the GraphQL request
    const response = await client.request<{ user: User }>(GET_USER);
    return response.user;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return undefined;
  }
}
