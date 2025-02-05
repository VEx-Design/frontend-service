import {
  createParameterData,
  createParameterSchema,
} from "../../schema/parameter";
import { Config } from "../../types/config";

export default function createParameter(
  form: createParameterData,
  config: Config
): Promise<Config> {
  const { success, data } = createParameterSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  config.parameters.push({
    id: crypto.randomUUID(),
    name: data.name,
    symbol: data.symbol,
  });

  return Promise.resolve(config);
}
