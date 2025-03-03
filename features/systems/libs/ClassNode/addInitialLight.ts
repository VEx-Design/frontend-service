import { NodeData } from "./types/AppNode";

export default function addInitialLight(node: NodeData): NodeData {
  if (!node.initials) {
    node.initials = [];
  }
  node.initials.push({
    id: crypto.randomUUID(),
    params: [],
  });
  return node;
}
