import { NodeData } from "./types/AppNode";

export default function addInitialLight(node: NodeData): NodeData {
  if (!node.initials) {
    node.initials = [];
  }
  const randomColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
  node.initials.push({
    id: crypto.randomUUID(),
    params: [],
    path: {
      id: crypto.randomUUID(),
      color: randomColor,
    },
  });
  return node;
}
