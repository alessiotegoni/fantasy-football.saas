import { splitStatuses } from "@/drizzle/schema";
import { getSerialIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const splitSchema = z.object({
  name: z.string().min(3, "Il nome deve essere di almeno 3 caratteri"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(splitStatuses),
});

export const updateSplitSchema = z
  .object({
    id: getSerialIdSchema(),
  })
  .merge(splitSchema);

export type SplitSchema = z.infer<typeof splitSchema>;
export type UpdateSplitSchema = z.infer<typeof updateSplitSchema>;
