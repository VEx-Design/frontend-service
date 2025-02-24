import { Config } from "../ClassConfig/types/Config";
import { AppNode } from "../ClassNode/types/AppNode";
import { Flow } from "./types/Flow";

export default function addInterface(flow: Flow, config: Config): Flow {
  const updatedNodes: AppNode[] = flow.nodes.map((node) => {
    if (node.type !== "ObjectNode") return node;

    const NodeObject = node.data.data.object;
    if (!NodeObject) return node;
    const interfaces = NodeObject.interfaces;
    const type = config.types.find((type) => type.id === NodeObject.typeId);

    if (!type || !interfaces) return node;

    return {
      ...node,
      data: {
        ...node.data,
        data: {
          ...node.data.data,
          object: {
            ...NodeObject,
            interfaces: type.interfaces.map((inter) => {
              const interfaceId = inter.id;
              return (
                interfaces.find((i) => i.interfaceId === interfaceId) || {
                  interfaceId,
                  input: [],
                  output: [],
                }
              );
            }),
          },
        },
      },
    };
  });

  return { ...flow, nodes: updatedNodes };
}
