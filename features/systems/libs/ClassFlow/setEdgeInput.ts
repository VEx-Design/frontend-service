import setLightEdge from "../ClassEdge/setLightEdge";
import { Light } from "../ClassLight/types/Light";
import { Flow } from "./types/Flow";

export default function setEdgeInput(
  flow: Flow,
  edgeId: string,
  input: Light[]
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
                ...setLightEdge(edge.data.data, input),
              },
            },
          }
        : edge
    ),
  };
  return resultFlow;
}
