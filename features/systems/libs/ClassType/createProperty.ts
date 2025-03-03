import {
  createPropertyData,
  createPropertySchema,
} from "../../schema/property";
import { Property } from "./types/Type";

export default function createProperty(
  form: createPropertyData
): Promise<Property> {
  const { success, data } = createPropertySchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  return Promise.resolve({
    id: crypto.randomUUID(),
    name: data.name,
    symbol: data.symbol,
    unitId: data.unitId,
    description: data.description,
  });
}
