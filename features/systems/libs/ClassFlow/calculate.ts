import { AppEdge } from "../ClassEdge/types/AppEdge";
import { AppNode } from "../ClassNode/types/AppNode";
import { Parameter } from "../ClassParameter/types/Parameter";
import setInput from "./setEdgeInput";
import { Flow } from "./types/Flow";

export default function calculate(flow: Flow, params: Parameter[]): Flow {
  const { nodes, edges } = flow;
  let resultFlow = flow;
  const stater: AppNode[] = nodes.filter((node) => node.type === "starter");
  const processQueue: AppEdge[] = edges.filter((edge) =>
    stater.some((node) => node.id === edge.source)
  );

  while (processQueue.length > 0) {
    const edge = processQueue.shift();
    if (!edge) continue;

    const { source } = edge;
    const sourceNode = nodes.find((node) => node.id === source);
    if (sourceNode?.type === "starter") {
      const input = params.map((param) => ({
        paramId: param.id,
        value:
          sourceNode.data.data.initials?.find(
            (initial) => initial.paramId === param.id
          )?.value || 0,
      }));
      resultFlow = setInput(resultFlow, edge.id, input);
    } else if (sourceNode?.type === "object") {
    }
  }
  return resultFlow;
}
