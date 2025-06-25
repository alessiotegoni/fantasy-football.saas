import { db } from "@/drizzle/db";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeaguePlayersCache } from "../../leagues/db/cache/league";
import { revalidateTeamPlayersCache } from "./cache/teamsPlayer";
import { and, eq, inArray } from "drizzle-orm";

export const getError = (
  message = "Errore nell'inserimento del giocatore nel team"
) => getErrorObject(message);

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

  if (!res.length) throw new Error(getError().message);

  revalidateLeaguePlayersCache(leagueId);
  players.forEach((player) => {
    revalidateTeamPlayersCache(player.memberTeamId);
  });
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

  if (!res.playerId) throw new Error(getError().message);

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(memberTeamId);
}
