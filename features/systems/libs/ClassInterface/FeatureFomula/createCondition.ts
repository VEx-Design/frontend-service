import {
  createConditionData,
  createConditionSchema,
} from "@/features/systems/schema/condition";
import { FormulaCondition } from "../types/Formula";

export default function createCondition(
  form: createConditionData
): Promise<FormulaCondition> {
  const { success, data } = createConditionSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  return Promise.resolve({
    id: crypto.randomUUID(),
    type: data.action,
    interfaceId: data.interface,
    formulas: [],
  });
}
