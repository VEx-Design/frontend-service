import {
  createParameterGroupData,
  createParameterGroupSchema,
} from "../../schema/parameterGroup";
import { ParameterGroup } from "../ClassConfig/types/Config";

export default function createParameterGroup(
  form: createParameterGroupData
): Promise<ParameterGroup> {
  const { success, data } = createParameterGroupSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  return Promise.resolve({
    id: crypto.randomUUID(),
    name: data.name,
    parameterIds: [],
  });
}
