import { revalidateTag } from "next/cache";
import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getLeagueGlobalTag } from "@/cache/global";

export type LEAGUE_TAG =
  | "league-premium"
  | "league-bans"
  | "league-available-players"
  | "league-matches"
  | "league-matchdays-calculations"
  | "league-standing";

export const getLeagueIdTag = (leagueId: string) =>
  getIdTag("leagues", leagueId);

export const getLeaguePremiumTag = (leagueId: string) =>
  getIdTag("league-premium", leagueId);

export const getLeagueAvailablePlayersTag = (leagueId: string) =>
  getLeagueTag("league-available-players", leagueId);

export const getLeagueMatchesTag = (leagueId: string) =>
  getLeagueTag("league-matches", leagueId);

export const getLeagueMatchdaysCalculationsTag = (leagueId: string) =>
  getLeagueTag("league-matchdays-calculations", leagueId);

export const getLeagueStandingTag = (leagueId: string) =>
  getLeagueTag("league-standing", leagueId);

export const getLeagueBansTag = (leagueId: string) =>
  getLeagueTag("league-bans", leagueId);

export const getLeagueMatchesResultsTag = (leagueId: string) =>
  getLeagueTag("matches-results", leagueId);

export const revalidateLeagueCache = ({
  leagueId,
  visibility,
}: {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
}) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueIdTag(leagueId));
};

export const revalidateLeaguePlayersCache = (leagueId: string) =>
  revalidateTag(getLeagueAvailablePlayersTag(leagueId));

export const revalidateLeaguePremiumCache = (leagueId: string) =>
  revalidateTag(getLeaguePremiumTag(leagueId));
