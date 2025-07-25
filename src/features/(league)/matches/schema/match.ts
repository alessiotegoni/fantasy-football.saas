import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";
import { positionIdSchema } from "./matchTacticalModule";
import { lineupPlayerTypes, PRESIDENT_POSITION_ID } from "@/drizzle/schema";
import { getTacticalModules } from "../../options/queries/leagueOptions";
import { getLeagueModules } from "../../leagues/queries/league";

const lineupPlayerSchema = z
  .object({
    id: getSerialIdSchema(),
    positionId: positionIdSchema.nullable(),
    positionOrder: z.number().int().positive(),
    lineupPlayerType: z.enum(lineupPlayerTypes),
  })
  .superRefine((player, ctx) => {
    if (player.lineupPlayerType === "starter" && !player.positionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Starter player must have a positionId",
        path: ["positionId"],
      });
      return;
    }

    if (player.positionId) {
      const [, id] = player.positionId.split("-");
      if (parseInt(id) !== player.positionOrder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid positionOrder",
          path: ["positionOrder"],
        });
        return;
      }
    }
  });

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
      return;
    }

    const validPositionIds = new Set([
      ...selectedModule.layout.flatMap((role) => role.positionsIds),
      PRESIDENT_POSITION_ID,
    ]);

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
      return;
    }

    const benchPlayers = data.lineupPlayers.filter(
      (player) => player.lineupPlayerType === "bench"
    );

    const hasInvalidPositionOrder = benchPlayers.some(
      (player) => player.positionOrder > benchPlayers.length
    );

    if (hasInvalidPositionOrder) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid bench players positionOrder`,
        path: [`lineupPlayers`],
      });
    }
  });

export type MatchLineupSchema = z.infer<typeof matchLineupSchema>;
