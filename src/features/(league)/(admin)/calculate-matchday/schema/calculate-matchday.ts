import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const calculateMatchdaySchema = z.object({
  leagueId: getUUIdSchema(),
  matchdayId: getSerialIdSchema(),
});

export const recalculateMatchdaySchema = z
  .object({
    calculationId: getUUIdSchema(),
  })
  .merge(calculateMatchdaySchema);

export type CalculateMatchdaySchema = z.infer<typeof calculateMatchdaySchema>;
export type RecalculateMatchdaySchema = z.infer<
  typeof recalculateMatchdaySchema
>;
