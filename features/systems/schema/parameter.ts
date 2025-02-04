import { z } from "zod";

export const createParameterSchema = z.object({
  name: z.string().max(50).nonempty({ message: "Name is required" }),
  symbol: z.string().max(5).nonempty({ message: "Symbol is required" }),
});

export type createParameterData = z.infer<typeof createParameterSchema>;
