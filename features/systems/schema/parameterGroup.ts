import { z } from "zod";

export const createParameterGroupSchema = z.object({
  name: z.string().max(50).nonempty({ message: "Name is required" }),
});

export type createParameterGroupData = z.infer<
  typeof createParameterGroupSchema
>;
