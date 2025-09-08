import { getPlayerRolesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getTeamPlayersPerRoleTag,
  getTeamPlayersTag,
} from "../db/cache/teamsPlayer";
import {
  leagueMemberTeamPlayers,
  leagueMemberTeams,
  playerRoles,
  players,
  PRESIDENT_ROLE_ID,
  teams,
} from "@/drizzle/schema";
import { count, eq, inArray } from "drizzle-orm";

export async function getPlayersRoles() {
  "use cache";
  cacheTag(getPlayerRolesTag());

  return db.query.playerRoles.findMany();
}

export type PlayerRole = typeof playerRoles.$inferSelect

export async function getRolesWithoutPresident() {
  const roles = await getPlayersRoles();

  return roles.filter((role) => role.id !== PRESIDENT_ROLE_ID);
}

export async function getTeamsPlayers(teamsIds: string[]) {
  "use cache";
  cacheTag(...teamsIds.map(getTeamPlayersTag));

  return db
    .select({
      id: players.id,
      displayName: players.displayName,
      avatarUrl: players.avatarUrl,
      role: playerRoles,
      team: teams,
      leagueTeamId: leagueMemberTeamPlayers.memberTeamId,
      purchaseCost: leagueMemberTeamPlayers.purchaseCost,
    })
    .from(leagueMemberTeamPlayers)
    .innerJoin(players, eq(players.id, leagueMemberTeamPlayers.playerId))
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
    .innerJoin(teams, eq(teams.id, players.teamId))
    .where(inArray(leagueMemberTeamPlayers.memberTeamId, teamsIds));
}

export type TeamPlayer = Awaited<ReturnType<typeof getTeamsPlayers>>[number];

export async function getTeamPlayerPerRoles(teamId: string) {
  "use cache";
  cacheTag(getTeamPlayersPerRoleTag(teamId));

  return db
    .select({
      roleId: playerRoles.id,
      playersCount: count(leagueMemberTeamPlayers),
    })
    .from(leagueMemberTeamPlayers)
    .innerJoin(players, eq(players.id, leagueMemberTeamPlayers.playerId))
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
    .where(eq(leagueMemberTeamPlayers.memberTeamId, teamId))
    .groupBy(playerRoles.id);
}

export function getTeamCredits(teamId: string) {
  return db
    .select({ credits: leagueMemberTeams.credits })
    .from(leagueMemberTeams)
    .where(eq(leagueMemberTeams.id, teamId))
    .then(([res]) => res.credits);
}
