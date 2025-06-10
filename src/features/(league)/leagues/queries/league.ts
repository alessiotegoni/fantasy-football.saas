import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueInviteCredentialsTag,
  getLeaguePremiumTag,
} from "../db/cache/league";
import { isPremiumUnlocked } from "../permissions/league";
import { getLeagueGeneralOptionsTag, getLeaguePlayersPerRoleTag } from "@/features/(league)/leagueOptions/db/cache/leagueOption";
import { db } from "@/drizzle/db";
import { getMemberIdTag } from "../../leagueMembers/db/cache/leagueMember";
import { isLeagueAdmin } from "../../leagueMembers/permissions/leagueMember";

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
    getLeagueGeneralOptionsTag(leagueId)
  );

  return db.query.leagues.findFirst({
    columns: {
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
