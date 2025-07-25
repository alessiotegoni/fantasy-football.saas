"use server";

import { createError, createSuccess } from "@/lib/helpers";
import { matchLineupSchema, MatchLineupSchema } from "../schema/match";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getUserId } from "@/features/users/utils/user";
import { canSaveLineup } from "../permissions/match";
import { db } from "@/drizzle/db";
import {
  deleteLineupPlayers,
  insertLineup,
  insertLineupPlayers,
} from "../db/match";
import { leagueMatchLineupPlayers } from "@/drizzle/schema";

export async function saveLineup(values: MatchLineupSchema) {
  const { success, data, error } = await matchLineupSchema.safeParseAsync(
    values
  );
  console.log(error);
  if (!success) return createError(VALIDATION_ERROR);


  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const validation = await canSaveLineup({ ...data, userId });
  if (validation.error) return validation;

  await db.transaction(async (tx) => {
    let lineupId = validation.data.lineupId;
    if (!lineupId) {
      lineupId = await insertLineup(
        { ...data, teamId: validation.data.userTeamId },
        tx
      );
    }

    await deleteLineupPlayers(lineupId, data.matchId, tx);
    if (data.lineupPlayers.length) {
      const lineupPlayers = mapLineupPlayers(lineupId, data.lineupPlayers);
      await insertLineupPlayers(data.matchId, lineupPlayers, tx);
    }
  });

  return createSuccess("", null);
}

function mapLineupPlayers(
  lineupId: string,
  lineupPlayers: MatchLineupSchema["lineupPlayers"]
): (typeof leagueMatchLineupPlayers.$inferInsert)[] {
  return lineupPlayers.map(
    ({ id: playerId, lineupPlayerType: playerType, ...positions }) => ({
      lineupId,
      playerId,
      playerType,
      ...positions,
    })
  );
}
