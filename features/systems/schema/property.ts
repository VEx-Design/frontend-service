import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string().max(50).nonempty({ message: "Name is required" }),
  symbol: z.string().max(5).nonempty({ message: "Symbol is required" }),
  description: z.string().max(100).optional(),
});

export type createPropertyData = z.infer<typeof createPropertySchema>;
