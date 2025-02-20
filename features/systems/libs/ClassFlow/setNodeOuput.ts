import { ObjectOutput } from "../ClassObject/types/Object";
import { Flow } from "./types/Flow";

export default function setNodeOutput(
  flow: Flow,
  nodeId: string,
  interfaceId: string,
  output: ObjectOutput[]
): Flow {
  const resultFlow = {
    ...flow,
    nodes: flow.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              data: {
                ...node.data.data,
                object: {
                  name: node.data.data.object?.name ?? "",
                  typeId: node.data.data.object?.typeId ?? "",
                  vars: node.data.data.object?.vars ?? [],
                  interfaces: (() => {
                    const interfaces = node.data.data.object?.interfaces ?? [];
                    const interfaceIndex = interfaces.findIndex(
                      (inter) => inter.interfaceId === interfaceId
                    );
                    if (interfaceIndex !== -1) {
                      return interfaces.map((inter, index) =>
                        index === interfaceIndex
                          ? {
                              ...inter,
                              output: output,
                            }
                          : inter
                      );
                    } else {
                      return [
                        ...interfaces,
                        {
                          interfaceId,
                          input: [],
                          output: output,
                        },
                      ];
                    }
                  })(),
                },
              },
            },
          }
        : node
    ),
  };
  return resultFlow;
}
