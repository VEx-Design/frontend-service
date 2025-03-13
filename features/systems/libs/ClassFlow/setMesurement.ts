import { Light } from "../ClassLight/types/Light";
import { Flow } from "./types/Flow";

export default function setMesurement(
  flow: Flow,
  nodeId: string,
  input: Light[]
): Flow {
  return {
    ...flow,
    nodes: flow.nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            data: {
              ...node.data.data,
              mesurement: input,
            },
          },
        };
      } else {
        return node;
      }
    }),
  };
}
