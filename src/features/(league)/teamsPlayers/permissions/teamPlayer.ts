import { db } from "@/drizzle/db";
import { TeamPlayerSchema } from "../schema/teamsPlayer";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { isLeagueAdmin } from "../../leagueMembers/permissions/leagueMember";

export async function canInsertPlayer({
  userId,
  memberTeamId,
  playerId,
  leagueId,
}: TeamPlayerSchema & { userId: string }) {
  const [isAdmin, hasPlayer] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    hasAlreadyPlayer(memberTeamId, playerId),
  ]);

  if (!isAdmin) {
    return {
      canCreate: false,
      message:
        "Per aggiungere giocatori alle squadre devi essere admin della lega",
    };
  }

  if (hasPlayer) {
    return {
      canCreate: false,
      message: "Il giocatore e' gia stato aggiunto a questa squadra",
    };
  }

  // TODO: fetchare leaguePlayerPerRole e tramite una query con groupby e count su memberTeamPlayers
  // vedere se il count di quello specifico ruolo e' maggiore del count settato dalla lega

  return { canCreate: true };
}

async function hasAlreadyPlayer(teamId: string, playerId: string) {
  const [res] = await db
    .select({ count: count(leagueMemberTeamPlayers) })
    .from(leagueMemberTeamPlayers)
    .where(
      and(
        eq(leagueMemberTeamPlayers.memberTeamId, teamId),
        eq(leagueMemberTeamPlayers.playerId, playerId)
      )
    );

  return !!res.count;
}
