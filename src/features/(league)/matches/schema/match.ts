import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";
import { positionIdSchema } from "./matchTacticalModule";
import { lineupPlayerTypes } from "@/drizzle/schema";

const lineupPlayerSchema = z
  .object({
    id: getSerialIdSchema(),
    positionId: positionIdSchema.nullable(),
    positionOrder: z.number().int().positive(),
    type: z.enum(lineupPlayerTypes),
  })
  .refine((player) => {
    if (player.type === "starter" && !player.positionId) return false;

    return true;
  });

export const matchLineupSchema = z.object({
  lineupId: getUUIdSchema().nullable(),
  matchId: getUUIdSchema(),
  tacticalModuleId: getSerialIdSchema(),
  lineupPlayers: z.array(lineupPlayerSchema),
});
