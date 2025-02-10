import { NodeData } from "./types/AppNode";

export default function getInitial(node: NodeData, paramId: string): number {
  const initial = node.initials?.find((initial) => initial.paramId === paramId);
  return initial?.value ?? 0;
}
