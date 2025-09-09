import { splitStatuses } from "@/drizzle/schema";
import { matchdayTypes } from "@/drizzle/schema/splitMatchdays";
import { z } from "zod";

const splitMatchdaySchema = z.object({
  number: z.coerce.number().min(1, "Il numero deve essere di almeno 1"),
  startAt: z.date(),
  endAt: z.date(),
  status: z.enum(splitStatuses),
  type: z.enum(matchdayTypes),
});

export const createSplitMatchdaySchema = z.object({
  matchdays: z.array(splitMatchdaySchema),
});
export const editSplitMatchdaySchema = splitMatchdaySchema;

export type CreateSplitMatchdaySchema = z.infer<
  typeof createSplitMatchdaySchema
>;
export type EditSplitMatchdaySchema = z.infer<typeof editSplitMatchdaySchema>;
