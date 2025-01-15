import { NodeData, ObjectVariableType } from "../types/object";

export const editObjectValueById = (
  id: string,
  value: string,
  data: NodeData
): NodeData => {
  if (!data.object) {
    return data;
  }

  const vars: ObjectVariableType[] = (data.object?.vars ?? []).map(
    (variable) => {
      if (variable.id === id) {
        return { ...variable, value };
      }
      return variable;
    }
  );

  return {
    ...data,
    object: { ...data.object, vars: vars ?? [] },
  };
};
