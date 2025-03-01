import { NodeData } from "../ClassNode/types/AppNode";

export function getVarPrefixId(node: NodeData, propId: string): string {
  const variable = node.object?.vars.find(
    (variable) => variable.propId === propId
  );
  return variable?.unitPrefixId ?? "MILLI";
}

export function getParamPrefixId(
  node: NodeData,
  lightId: string,
  paramId: string
): string {
  const light = node.initials?.find((light) => light.id === lightId);
  const param = light?.params?.find((param) => param.paramId === paramId);

  return param?.unitPrefixId ?? "MILLI";
}
