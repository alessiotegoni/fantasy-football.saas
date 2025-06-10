import { db } from "@/drizzle/db";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeaguePlayersCache } from "../../leagues/db/cache/league";
import { revalidateTeamPlayersCache } from "./cache/teamPlayer";
import { and, eq } from "drizzle-orm";

export const getError = (
  message = "Errore nell'inserimento del giocatore nel team"
) => getErrorObject(message);

export async function insertTeamPlayer(
  leagueId: string,
  {
    memberTeamId,
    playerId,
    purchaseCost,
  }: typeof leagueMemberTeamPlayers.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMemberTeamPlayers)

    .values({ memberTeamId, playerId, purchaseCost })
    .returning({ playerId: leagueMemberTeamPlayers.playerId });

  if (!res.playerId) throw new Error(getError().message);

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(memberTeamId);

  return res.playerId;
}

export async function deleteTeamPlayer(
  {
    teamId,
    playerId,
    leagueId,
  }: {
    teamId: string;
    playerId: string;
    leagueId: string;
  },
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueMemberTeamPlayers)
    .where(
      and(
        eq(leagueMemberTeamPlayers.memberTeamId, teamId),
        eq(leagueMemberTeamPlayers.playerId, playerId)
      )
    )
    .returning({ playerId: leagueMemberTeamPlayers.playerId });

  if (!res.playerId) throw new Error(getError().message);

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(teamId);
}
