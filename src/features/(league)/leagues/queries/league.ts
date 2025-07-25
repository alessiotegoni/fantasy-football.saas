import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueInviteCredentialsTag,
  getLeaguePremiumTag,
  getLeagueProfileTag,
} from "../db/cache/league";
import { isPremiumUnlocked } from "../permissions/league";
import {
  getLeagueGeneralOptionsTag,
  getLeagueModulesTag,
  getLeaguePlayersPerRoleTag,
} from "@/features/(league)/options/db/cache/leagueOption";
import { db } from "@/drizzle/db";
import { getMemberIdTag } from "../../members/db/cache/leagueMember";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";

export async function getLeaguePremium(leagueId: string) {
  "use cache";
  cacheTag(getLeaguePremiumTag(leagueId));

  return await isPremiumUnlocked(leagueId);
}

export async function getLeagueAdmin(userId: string, leagueId: string) {
  "use cache";
  cacheTag(getMemberIdTag(leagueId));

  return await isLeagueAdmin(userId, leagueId);
}

export async function getLeagueInviteCredentials(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueInviteCredentialsTag(leagueId),
    getLeagueGeneralOptionsTag(leagueId),
    getLeagueProfileTag(leagueId)
  );

  return db.query.leagues.findFirst({
    columns: {
      visibility: true,
      joinCode: true,
      password: true,
    },
    where: (league, { eq }) => eq(league.id, leagueId),
  });
}

export async function getLeaguePlayersPerRole(leagueId: string) {
  "use cache";
  cacheTag(getLeaguePlayersPerRoleTag(leagueId));

  return db.query.leagueOptions
    .findFirst({
      columns: {
        playersPerRole: true,
      },
      where: (options, { eq }) => eq(options.leagueId, leagueId),
    })
    .then((res) => res!.playersPerRole);
}

export async function getLeagueModules(leagueId: string) {
  "use cache";
  cacheTag(getLeagueModulesTag(leagueId));

  return db.query.leagueOptions
    .findFirst({
      columns: {
        tacticalModules: true,
      },
      where: (options, { eq }) => eq(options.leagueId, leagueId),
    })
    .then((res) => res!.tacticalModules);
}
