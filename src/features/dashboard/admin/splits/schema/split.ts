import { getSerialIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const addSplitSchema = z.object({
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export const updateSplitSchema = z
  .object({
    id: getSerialIdSchema(),
  })
  .merge(addSplitSchema);

export type AddSplitSchema = z.infer<typeof addSplitSchema>;
export type UpdateSplitSchema = z.infer<typeof updateSplitSchema>;
