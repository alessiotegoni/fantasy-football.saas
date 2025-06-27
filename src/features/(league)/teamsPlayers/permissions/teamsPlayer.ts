import { db } from "@/drizzle/db";
import { InsertTeamPlayerSchema } from "../schema/teamsPlayer";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";
import { getTeamPlayerPerRoles } from "../queries/teamsPlayer";
import { getLeaguePlayersPerRole } from "../../leagues/queries/league";

export async function canInsertPlayer({
  userId,
  memberTeamId,
  player,
  leagueId,
}: InsertTeamPlayerSchema & { userId: string }) {
  const [isAdmin, hasPlayer, isSlotFull] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    hasAlreadyPlayer(memberTeamId, player.id),
    isTeamRoleSlotFull(leagueId, memberTeamId, [player.roleId]),
  ]);

  console.log(isSlotFull);

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

  if (isSlotFull) {
    return {
      canCreate: false,
      message:
        "La squadra ha gia raggiunto il numero massimo di giocatori in quel ruolo",
    };
  }

  return { canCreate: true };
}

async function hasAlreadyPlayer(teamId: string, playerId: number) {
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

async function isTeamRoleSlotFull(
  leagueId: string,
  teamId: string,
  playerRoleIds: number[]
) {
  const [leaguePpr, teamPpr] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getTeamPlayerPerRoles(teamId),
  ]);

  const fullRolesSlot: number[] = [];

  for (const playerRoleId of playerRoleIds) {
    const maxPlayersRole = leaguePpr[playerRoleId];
    const playersRoleCount = teamPpr.find(
      (ppr) => ppr.roleId === playerRoleId
    )?.playersCount;

    if (!playersRoleCount) continue;

    if (playersRoleCount >= maxPlayersRole) fullRolesSlot.push(playerRoleId);
  }

  return fullRolesSlot.some(Boolean);
}
