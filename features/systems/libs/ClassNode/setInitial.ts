import { NodeData } from "./types/AppNode";

export default function setInitial(
  node: NodeData,
  paramId: string,
  value: number
): NodeData {
  const initial = node.initials?.find((initial) => initial.paramId === paramId);
  if (initial) {
    initial.value = value;
  } else {
    node.initials = node.initials || [];
    node.initials.push({ paramId, value });
  }
  return node;
}
