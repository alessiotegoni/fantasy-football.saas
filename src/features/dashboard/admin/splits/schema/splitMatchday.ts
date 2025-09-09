import { splitStatuses } from "@/drizzle/schema";
import { matchdayTypes } from "@/drizzle/schema/splitMatchdays";
import { z } from "zod";

export const editSplitMatchdaySchema = z.object({
  number: z.number().min(1, "Il numero deve essere di almeno 1"),
  startAt: z.date(),
  endAt: z.date(),
  status: z.enum(splitStatuses),
  type: z.enum(matchdayTypes),
});

export type EditSplitMatchdaySchema = z.infer<typeof editSplitMatchdaySchema>;
