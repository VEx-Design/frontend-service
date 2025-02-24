import { Light } from "../ClassLight/types/Light";
import { Flow } from "./types/Flow";
import setObjectInput from "../ClassObject/setObjectInput";

export default function setNodeInput(
  flow: Flow,
  nodeId: string,
  interfaceId: string,
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
              object: node.data.data.object
                ? setObjectInput(node.data.data.object, interfaceId, input)
                : node.data.data.object,
            },
          },
        };
      } else {
        return node;
      }
    }),
  };
}
