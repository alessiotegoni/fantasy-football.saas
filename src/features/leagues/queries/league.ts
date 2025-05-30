import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeaguePremiumTag } from "../db/cache/league";
import { isPremiumUnlocked } from "../permissions/league";
import { getMemberIdTag } from "@/features/leagueMembers/db/cache/leagueMember";
import { isLeagueAdmin } from "@/features/leagueMembers/permissions/leagueMember";

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
