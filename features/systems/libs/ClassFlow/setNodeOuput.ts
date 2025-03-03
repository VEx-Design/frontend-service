import { Light } from "../ClassLight/types/Light";
import setObjectOutput from "../ClassObject/setObjectOutput";
import { Flow } from "./types/Flow";

export default function setNodeOutput(
  flow: Flow,
  nodeId: string,
  interfaceId: string,
  formInterfaceId: string,
  output: Light[]
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
                ? setObjectOutput(
                    node.data.data.object,
                    interfaceId,
                    formInterfaceId,
                    output
                  )
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
