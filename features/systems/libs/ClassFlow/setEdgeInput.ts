import { LightInput } from "../ClassLight/types/Light";
import { Flow } from "./types/Flow";

export default function setEdgeInput(
  flow: Flow,
  edgeId: string,
  input: LightInput[]
): Flow {
  const resultFlow = {
    ...flow,
    edges: flow.edges.map((edge) =>
      edge.id === edgeId
        ? {
            ...edge,
            data: {
              ...edge.data,
              data: {
                ...edge.data.data,
                light: edge.data.data.light
                  ? {
                      ...edge.data.data.light,
                      input,
                    }
                  : undefined,
              },
            },
          }
        : edge
    ),
  };
  return resultFlow;
}
