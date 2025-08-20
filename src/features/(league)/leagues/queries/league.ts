import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueInviteCredentialsTag,
  getLeaguePremiumTag,
  getLeagueProfileTag,
} from "../db/cache/league";
import {
  getLeagueGeneralSettingsTag,
  getLeagueModulesTag,
  getLeaguePlayersPerRoleTag,
} from "@/features/(league)/settings/db/cache/setting";
import { db } from "@/drizzle/db";
import { getMemberIdTag } from "../../members/db/cache/leagueMember";
import {
  leagueMembers,
  leagues,
  leagueSettings,
  userSubscriptions,
} from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { isValidSubscription } from "@/features/users/permissions/user";

export async function getLeaguePremium(leagueId: string) {
  "use cache";
  cacheTag(getLeaguePremiumTag(leagueId));

  const [result] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .innerJoin(
      leagueMembers,
      eq(leagueMembers.userId, userSubscriptions.userId)
    )
    .innerJoin(leagues, eq(leagues.id, leagueMembers.leagueId))
    .where(and(eq(leagues.id, leagueId), isValidSubscription));

  return result.count > 0;
}

export async function getLeagueAdmin(userId: string, leagueId: string) {
  "use cache";
  cacheTag(getMemberIdTag(leagueId));

  const [result] = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId),
        eq(leagueMembers.role, "admin")
      )
    );

  return result.count === 1;
}

export async function getLeagueInviteCredentials(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueInviteCredentialsTag(leagueId),
    getLeagueGeneralSettingsTag(leagueId),
    getLeagueProfileTag(leagueId)
  );

  const [league] = await db
    .select({
      visibility: leagues.visibility,
      joinCode: leagues.joinCode,
      password: leagues.password,
    })
    .from(leagues)
    .where(eq(leagues.id, leagueId));

  return league;
}

export async function getLeaguePlayersPerRole(leagueId: string) {
  "use cache";
  cacheTag(getLeaguePlayersPerRoleTag(leagueId));

  const [settings] = await db
    .select({
      playersPerRole: leagueSettings.playersPerRole,
    })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return settings.playersPerRole;
}

export async function getLeagueModules(leagueId: string) {
  "use cache";
  cacheTag(getLeagueModulesTag(leagueId));

  const [settings] = await db
    .select({
      tacticalModules: leagueSettings.tacticalModules,
    })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return settings.tacticalModules;
}

export async function getLeagueVisibility(leagueId: string) {
  const [league] = await db
    .select({ visibility: leagues.visibility })
    .from(leagues)
    .where(eq(leagues.id, leagueId));

  return league.visibility;
}
