import { z } from "zod";

export const createTypeSchema = z.object({
  name: z.string().max(50).nonempty({ message: "Name is required" }),
  description: z.string().max(80).optional(),
});

export type createTypeData = z.infer<typeof createTypeSchema>;
