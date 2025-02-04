import { createTypeData, createTypeSchema } from "../schema/type";
import { Config } from "../types/config";

export default function createType(
  form: createTypeData,
  config: Config
): Promise<Config> {
  const { success, data } = createTypeSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  config.types.push({
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    picture: "",
    variables: [],
    interface: [],
  });

  return Promise.resolve(config);
}
