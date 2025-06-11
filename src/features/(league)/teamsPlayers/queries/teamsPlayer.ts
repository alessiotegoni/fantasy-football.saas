import { getPlayerRolesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getTeamPlayersPerRoleTag } from "../db/cache/teamsPlayer";
import {
  leagueMemberTeamPlayers,
  playerRoles,
  players,
} from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";

export async function getPlayersRoles() {
  "use cache";
  cacheTag(getPlayerRolesTag());

  return db.query.playerRoles.findMany();
}

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
    .groupBy(playerRoles.id)
}
