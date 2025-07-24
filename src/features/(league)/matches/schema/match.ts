import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";
import { positionIdSchema } from "./matchTacticalModule";
import { lineupPlayerTypes } from "@/drizzle/schema";

const lineupPlayerSchema = z
  .object({
    id: getSerialIdSchema(),
    positionId: positionIdSchema.nullable(),
    positionOrder: z.number().int().positive(),
    lineupPlayerType: z.enum(lineupPlayerTypes),
  })
  .refine((player) =>
    player.lineupPlayerType === "starter" && !player.positionId ? false : true
  );

export const matchLineupSchema = z.object({
  lineupId: getUUIdSchema().nullable(),
  matchId: getUUIdSchema(),
  tacticalModuleId: getSerialIdSchema(),
  lineupPlayers: z.array(lineupPlayerSchema),
});

export type MatchLineupSchema = z.infer<typeof matchLineupSchema>;
