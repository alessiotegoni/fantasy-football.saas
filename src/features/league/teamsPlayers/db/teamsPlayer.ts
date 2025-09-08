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

export async function insertTeamsPlayers(
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

export async function deleteTeamsPlayers(
  leagueId: string,
  {
    membersTeamsIds,
    playersIds,
  }: {
    membersTeamsIds: string[];
    playersIds?: number[];
  },
  tx: Omit<typeof db, "$client"> = db
) {
  await tx
    .delete(leagueMemberTeamPlayers)
    .where(
      and(
        inArray(leagueMemberTeamPlayers.memberTeamId, membersTeamsIds),
        playersIds
          ? inArray(leagueMemberTeamPlayers.playerId, playersIds)
          : undefined
      )
    );

  revalidateLeaguePlayersCache(leagueId);
  membersTeamsIds.forEach(revalidateTeamPlayersCache);
}
