import { db } from "@/drizzle/db";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { revalidateLeaguePlayersCache } from "../../leagues/db/cache/league";
import { revalidateTeamPlayersCache } from "./cache/teamsPlayer";
import { and, eq, inArray } from "drizzle-orm";
import { createError } from "@/utils/helpers";

enum DB_ERROR_MESSAGES {
  INSERT_PLAYERS = "Errore nell'inserimento dei giocatori nel team",
  DELETE_PLAYERS = "Errore nell'eliminazione dei giocatori nel team",
}

export async function insertTeamPlayers(
  leagueId: string,
  players: {
    playerId: number;
    purchaseCost: number;
    memberTeamId: string;
  }[],
  tx: Omit<typeof db, "$client"> = db
) {
  const res = await tx
    .insert(leagueMemberTeamPlayers)
    .values(players)
    .returning();

  if (!res.length) {
    throw new Error(createError(DB_ERROR_MESSAGES.INSERT_PLAYERS).message);
  }

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(players[0].memberTeamId);
}

export async function deleteTeamPlayers(
  leagueId: string,
  {
    memberTeamId,
    playersIds,
  }: {
    memberTeamId: string;
    playersIds: number[];
  },
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueMemberTeamPlayers)
    .where(
      and(
        eq(leagueMemberTeamPlayers.memberTeamId, memberTeamId),
        inArray(leagueMemberTeamPlayers.playerId, playersIds)
      )
    )
    .returning({ playerId: leagueMemberTeamPlayers.playerId });

  if (!res.playerId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETE_PLAYERS).message);
  }

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(memberTeamId);
}
