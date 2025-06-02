import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueInviteCredentialsTag,
  getLeaguePremiumTag,
} from "../db/cache/league";
import { isPremiumUnlocked } from "../permissions/league";
import { getMemberIdTag } from "@/features/leagueMembers/db/cache/leagueMember";
import { isLeagueAdmin } from "@/features/leagueMembers/permissions/leagueMember";
import { getLeagueGeneralOptionsTag } from "@/features/leagueOptions/db/cache/leagueOption";
import { db } from "@/drizzle/db";

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
