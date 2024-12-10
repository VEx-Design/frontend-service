import { AppNode } from "../types/appNode";
import { TaskType } from "../types/task";

export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "FlowScrapeNode",
    data: {
      type: nodeType,
      inputs: {},
      img: "/images/Picture4.png",
    },
    position: position ?? { x: 0, y: 0 },
  };
}
