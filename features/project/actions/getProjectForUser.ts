"use client";

import auth from "@/features/auth/actions/auth";
import { gql, GraphQLClient } from "graphql-request";
import { format } from "date-fns"; // Import date-fns for formatting

const GET_PROJECTS = gql`
  query GetProjects($ownerID: String!) {
    projects(ownerID: $ownerID) {
      id
      name
      owner {
        name
      }
      updatedAt
    }
  }
`;

type Project = {
  id: string;
  name: string;
  owner: {
    name: string;
  };
  updatedAt: string;
};

type Response = {
  id: string;
  name: string;
  owner: string;
  image_url: string;
  updatedAt: string;
  role: string;
};

export default async function getMyProjects(): Promise<Response[]> {
  const client = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/project-management-service/query`,
    { credentials: "include" }
  );

  const { userId } = await auth();

  type GetProjectsResponse = {
    projects: Project[];
  };

  // Helper function to get the day suffix
  const daySuffix = (day: number) => {
    if (day === 1 || day === 21 || day === 31) return "st";
    if (day === 2 || day === 22) return "nd";
    if (day === 3 || day === 23) return "rd";
    return "th";
  };

  try {
    const response = await client.request<GetProjectsResponse>(GET_PROJECTS, {
      ownerID: userId || "",
    });

    // Map through the projects and return formatted data
    return response.projects.map((project) => {
      // Ensure the updatedAt string is parsed into a Date object
      const date = new Date(project.updatedAt);

      // Format the date as "HH:mm on dth of Month, yyyy"
      const formattedDate = `${format(date, "HH:mm")} on ${format(
        date,
        "d"
      )}${daySuffix(+format(date, "d"))} of ${format(date, "MMMM")}, ${format(
        date,
        "yyyy"
      )}`;

      return {
        id: project.id,
        name: project.name,
        owner: project.owner.name,
        image_url: "", // Placeholder image URL
        updatedAt: formattedDate, // Formatted date
        role: "Can Edit",
      };
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}
