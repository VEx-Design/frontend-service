import { ObjectInput } from "../ClassObject/types/Object";
import { Flow } from "./types/Flow";

export default function setNodeInput(
  flow: Flow,
  nodeId: string,
  interfaceId: string,
  input: ObjectInput[]
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
                              input,
                            }
                          : inter
                      );
                    } else {
                      return [
                        ...interfaces,
                        {
                          interfaceId,
                          input,
                          output: [],
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
