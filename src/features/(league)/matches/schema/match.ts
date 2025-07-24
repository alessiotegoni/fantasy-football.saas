import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";
import { positionIdSchema } from "./matchTacticalModule";
import { lineupPlayerTypes } from "@/drizzle/schema";
import { getTacticalModules } from "../../options/queries/leagueOptions";
import { getLeagueModules } from "../../leagues/queries/league";

const lineupPlayerSchema = z
  .object({
    id: getSerialIdSchema(),
    positionId: positionIdSchema.nullable(),
    positionOrder: z.number().int().positive(),
    lineupPlayerType: z.enum(lineupPlayerTypes),
  })
  .refine(
    (player) =>
      player.lineupPlayerType === "starter" && !player.positionId
        ? false
        : true,
    {
      message: "Starter player must have a positionId",
      path: ["positionId"],
    }
  );

export const matchLineupSchema = z
  .object({
    lineupId: getUUIdSchema().nullable(),
    matchId: getUUIdSchema(),
    leagueId: getUUIdSchema(),
    tacticalModuleId: getSerialIdSchema(),
    lineupPlayers: z.array(lineupPlayerSchema),
  })
  .superRefine(async (data, ctx) => {
    const [tacticalModules, leagueModules] = await Promise.all([
      getTacticalModules(),
      getLeagueModules(data.leagueId),
    ]);

    if (!leagueModules) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "League modules not found",
        path: ["leagueId"],
      });
      return;
    }

    const selectedModule = tacticalModules.find(
      (module) => module.id === data.tacticalModuleId
    );

    if (!selectedModule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid tactical module",
        path: ["tacticalModuleId"],
      });
      return;
    }

    if (!leagueModules.includes(data.tacticalModuleId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tactical module not allowed for this league",
        path: ["tacticalModuleId"],
      });
    }

    const validPositionIds = new Set(
      selectedModule.layout.flatMap((role) => role.positionsIds)
    );

    const hasInvalidPositionId = data.lineupPlayers.some(
      (player) =>
        player.lineupPlayerType === "starter" &&
        player.positionId &&
        !validPositionIds.has(player.positionId)
    );

    if (hasInvalidPositionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid positionId for the selected tactical module`,
        path: [`lineupPlayers`],
      });
    }
  });

export type MatchLineupSchema = z.infer<typeof matchLineupSchema>;
