import { NodeData } from "./types/AppNode";

export default function getInitial(
  node: NodeData,
  lightId: string,
  paramId: string
): number {
  const light = node.initials?.find((light) => light.id === lightId);
  if (light) {
    const param = light.params.find((param) => param.paramId === paramId);
    if (param) {
      return param.value;
    }
  }
  return 0;
}
