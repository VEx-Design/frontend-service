import { NodeData } from "./types/AppNode";

export default function setInitial(
  node: NodeData,
  lightId: string,
  paramId: string,
  value: number
): NodeData {
  const light = node.initials?.find((light) => light.id === lightId);
  if (light) {
    const input = light.params.find((param) => param.paramId === paramId);
    if (input) {
      input.value = value;
    } else {
      light.params.push({ paramId, value });
    }
  } else {
    node.initials?.push({
      id: lightId,
      params: [{ paramId, value }],
    });
  }
  return node;
}
