import { getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const acquirePlayerSchema = z.object({
  nominationId: getUUIdSchema(),
});
export type AcquirePlayerSchema = z.infer<typeof acquirePlayerSchema>;
