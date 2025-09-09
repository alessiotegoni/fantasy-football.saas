import { z } from "zod";

export const editSplitSchema = z.object({
  name: z.string().min(3, "Il nome deve essere di almeno 3 caratteri"),
  startDate: z.date(),
  endDate: z.date(),
});

export type EditSplitSchema = z.infer<typeof editSplitSchema>;