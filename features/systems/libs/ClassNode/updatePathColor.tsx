import { NodeData } from "./types/AppNode";

export default function updatePathColor(
  node: NodeData,
  lightId: string,
  color: string
): NodeData {
  if (node.initials === undefined) {
    return node;
  }
  const light = node.initials?.find((light) => light.id === lightId);
  if (light) {
    light.path.color = color;
  } else {
    return node;
  }
  return node;
}
