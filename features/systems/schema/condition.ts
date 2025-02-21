import { z } from "zod";

export const createConditionSchema = z.object({
  action: z.enum(["TRIGGER AT"]),
  interface: z.string().nonempty(),
});

export type createConditionData = z.infer<typeof createConditionSchema>;
