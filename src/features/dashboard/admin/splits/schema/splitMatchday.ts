import { splitStatuses } from "@/drizzle/schema";
import { matchdayTypes } from "@/drizzle/schema/splitMatchdays";
import { getSerialIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const splitMatchdaySchema = z.object({
  number: z.number().min(1, "Il numero deve essere di almeno 1"),
  startAt: z.date(),
  endAt: z.date(),
  status: z.enum(splitStatuses),
  type: z.enum(matchdayTypes),
});

export const updateSplitMatchdaySchema = z
  .object({
    id: getSerialIdSchema(),
  })
  .merge(splitMatchdaySchema);

export type SplitMatchdaySchema = z.infer<typeof splitMatchdaySchema>;
export type UpdateSplitMatchdaySchema = z.infer<
  typeof updateSplitMatchdaySchema
>;
