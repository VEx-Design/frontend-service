import {
  createParameterData,
  createParameterSchema,
} from "../../schema/parameter";
import { Parameter } from "./types/Parameter";

export default function createParameter(
  form: createParameterData
): Promise<Parameter> {
  const { success, data } = createParameterSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  return Promise.resolve({
    id: crypto.randomUUID(),
    name: data.name,
    isStadard: false,
    symbol: data.symbol,
  });
}
