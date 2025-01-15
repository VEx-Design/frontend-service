import { gql, GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";

const GET_PROJECT = gql`
  query GetProject($id: String!) {
    project(id: $id) {
      name
      flow
    }
  }
`;

type Project = {
  name: string;
  flow: string;
};

export type ProjectResponse = {
  name: string;
  flow: string;
};

export default async function getProjectByID(
  projectId: string
): Promise<ProjectResponse | undefined> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("Authorization");

  const client = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/project-management-service/query`,
    {
      headers: {
        cookie: `Authorization=${sessionCookie?.value ?? ""}`,
      },
    }
  );

  type GetProjectsResponse = {
    project: Project;
  };

  try {
    const response = await client.request<GetProjectsResponse>(GET_PROJECT, {
      id: projectId || "",
    });

    // Map through the projects and return formatted data
    const project = response.project;

    return {
      name: project.name,
      flow: project.flow,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return undefined;
  }
}
