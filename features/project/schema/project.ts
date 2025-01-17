import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().max(50).nonempty({ message: "Name is required" }),
  description: z.string().max(80).optional(),
  configurationID: z.number().int().positive().optional(),
});

export type createProjectData = z.infer<typeof createProjectSchema>;
