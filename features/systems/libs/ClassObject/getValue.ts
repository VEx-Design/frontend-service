import { NodeData } from "../ClassNode/types/AppNode";

export default function getValue(node: NodeData, propId: string): string {
  const variable = node.object?.vars.find(
    (variable) => variable.propId === propId
  );
  return variable?.valueShow ?? "0";
}
