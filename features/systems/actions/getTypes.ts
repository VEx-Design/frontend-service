import { gql, GraphQLClient } from "graphql-request";

const GET_TYPE = gql`
  {
    types {
      id
      name
      picture
      variables {
        id
        name
        symbol
      }
      input
      output
    }
  }
`;

type Types = {
  id: string;
  name: string;
  picture: string;
  variables: {
    id: string;
    name: string;
    sysbol: string;
  }[];
  input: string;
  output: string;
}[];

export type TypesResponse = {
  id: string;
  name: string;
  picture: string;
  variables: {
    id: string;
    name: string;
    sysbol: string;
  }[];
  input: string;
  output: string;
};

export default async function getTypes(): Promise<TypesResponse[] | undefined> {
  const client = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/type-management-service/query`,
    {
      credentials: "include",
    }
  );

  type GetProjectsResponse = {
    types: Types;
  };

  try {
    const response = await client.request<GetProjectsResponse>(GET_TYPE);

    // Map through the types and return formatted data
    return response.types.map((type) => {
      return {
        id: type.id,
        name: type.name,
        picture: type.picture,
        variables: type.variables,
        input: type.input,
        output: type.output,
      };
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return undefined;
  }
}
