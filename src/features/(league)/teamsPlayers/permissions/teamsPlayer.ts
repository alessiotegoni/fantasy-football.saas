import { db } from "@/drizzle/db";
import { InsertTeamPlayerSchema } from "../schema/teamsPlayer";
import { leagueMemberTeamPlayers } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";
import { getTeamPlayerPerRoles } from "../queries/teamsPlayer";
import { getLeaguePlayersPerRole } from "../../leagues/queries/league";
import { createError, createSuccess } from "@/lib/helpers";

enum TEAM_PLAYER_MESSAGES {
  ADMIN_REQUIRED = "Per aggiungere giocatori alle squadre devi essere admin della lega",
  ALREADY_ADDED = "Il giocatore è già stato aggiunto a questa squadra",
  ROLE_FULL = "La squadra ha già raggiunto il numero massimo di giocatori in quel ruolo",
}

export async function canInsertPlayer({
  userId,
  memberTeamId,
  player,
  leagueId,
}: InsertTeamPlayerSchema & { userId: string }) {
  const [isAdmin, alreadyAdded, { isSlotFull }] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    hasPlayerAlready(memberTeamId, player.id),
    isTeamRoleSlotFull(leagueId, memberTeamId, [player.roleId]),
  ]);

  if (!isAdmin) return createError(TEAM_PLAYER_MESSAGES.ADMIN_REQUIRED);
  if (alreadyAdded) return createError(TEAM_PLAYER_MESSAGES.ALREADY_ADDED);
  if (isSlotFull) return createError(TEAM_PLAYER_MESSAGES.ROLE_FULL);

  return createSuccess("", null);
}

async function hasPlayerAlready(teamId: string, playerId: number) {
  const [res] = await db
    .select({ count: count() })
    .from(leagueMemberTeamPlayers)
    .where(
      and(
        eq(leagueMemberTeamPlayers.memberTeamId, teamId),
        eq(leagueMemberTeamPlayers.playerId, playerId)
      )
    );

  return res.count > 0;
}

export async function isTeamRoleSlotFull(
  leagueId: string,
  teamId: string,
  roleIds: number[]
) {
  const [leagueLimits, teamPlayers] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getTeamPlayerPerRoles(teamId),
  ]);

  const fullRoles = new Set<number>();

  for (const roleId of roleIds) {
    const maxAllowed = leagueLimits[roleId];
    const currentCount =
      teamPlayers.find((p) => p.roleId === roleId)?.playersCount ?? 0;

    if (currentCount >= maxAllowed) {
      fullRoles.add(roleId);
    }
  }

  return {
    fullRolesIdsSlot: fullRoles,
    isSlotFull: fullRoles.size > 0,
  };
}
