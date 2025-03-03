import { NodeData } from "../ClassNode/types/AppNode";

export default function setValue(
  node: NodeData,
  propId: string,
  value: number
): NodeData {
  const object = node.object;
  if (!object) {
    throw new Error("Object is undefined");
  }
  const variable = object.vars.find((variable) => variable.propId === propId);
  if (variable) {
    variable.value = value;
  } else {
    object.vars = object.vars || [];
    object.vars.push({ propId, value, unitPrefixId: "MILLI" });
  }
  return node;
}
