import { createTypeData, createTypeSchema } from "../../schema/type";
import { Type } from "./types/Type";

export default function createType(form: createTypeData): Promise<Type> {
  const { success, data } = createTypeSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  return Promise.resolve({
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    picture: "",
    properties: [],
    interface: [],
  });
}
