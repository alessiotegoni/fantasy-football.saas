import { db } from "@/drizzle/db";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeaguePlayersCache } from "../../leagues/db/cache/league";
import { revalidateTeamPlayersCache } from "./cache/teamsPlayer";
import { and, eq } from "drizzle-orm";
import { InsertTeamPlayerSchema } from "../schema/teamsPlayer";

export const getError = (
  message = "Errore nell'inserimento del giocatore nel team"
) => getErrorObject(message);

export async function insertTeamPlayer(
  { leagueId, memberTeamId, player, purchaseCost }: InsertTeamPlayerSchema,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMemberTeamPlayers)

    .values({ memberTeamId, playerId: player.id, purchaseCost })
    .returning({ playerId: leagueMemberTeamPlayers.playerId });

  if (!res.playerId) throw new Error(getError().message);

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(memberTeamId);

  return res.playerId;
}

export async function deleteTeamPlayer(
  {
    memberTeamId,
    playerId,
    leagueId,
  }: {
    memberTeamId: string;
    playerId: number;
    leagueId: string;
  },
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueMemberTeamPlayers)
    .where(
      and(
        eq(leagueMemberTeamPlayers.memberTeamId, memberTeamId),
        eq(leagueMemberTeamPlayers.playerId, playerId)
      )
    )
    .returning({ playerId: leagueMemberTeamPlayers.playerId });

  if (!res.playerId) throw new Error(getError().message);

  revalidateLeaguePlayersCache(leagueId);
  revalidateTeamPlayersCache(memberTeamId);
}
