import { revalidateTag } from "next/cache";
import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getLeagueGlobalTag } from "@/cache/global";

export type LEAGUE_TAG =
  | "league-invite-credentials"
  | "league-premium"
  | "league-name"
  | "league-profile"
  | "league-matches"
  | "league-matchdays-calculations"
  | "league-free-agents-players"
  | "league-players-list"
  | "league-standing"
  | "league-bans";

export const getLeagueIdTag = (leagueId: string) =>
  getIdTag("leagues", leagueId);

export const getLeaguePremiumTag = (leagueId: string) =>
  getIdTag("league-premium", leagueId);

export const getLeagueNameTag = (leagueId: string) =>
  getIdTag("league-name", leagueId);

export const getLeagueInviteCredentialsTag = (leagueId: string) =>
  getIdTag("league-invite-credentials", leagueId);

export const getLeagueProfileTag = (leagueId: string) =>
  getLeagueTag("league-profile", leagueId);

export const getLeagueMatchesTag = (leagueId: string) =>
  getLeagueTag("league-matches", leagueId);

export const getLeagueMatchdaysCalculationsTag = (leagueId: string) =>
  getLeagueTag("league-matchdays-calculations", leagueId);

export const getLeagueFreeAgentsPlayersTag = (leagueId: string) =>
  getLeagueTag("league-free-agents-players", leagueId);

export const getLeaguePlayersListTag = (leagueId: string) =>
  getLeagueTag("league-players-list", leagueId);

export const getLeagueStandingTag = (leagueId: string) =>
  getLeagueTag("league-standing", leagueId);

export const getLeagueBansTag = (leagueId: string) =>
  getLeagueTag("league-bans", leagueId);

export const revalidateLeagueProfileCache = ({
  leagueId,
  visibility,
}: {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
}) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueIdTag(leagueId));
  revalidateTag(getLeagueProfileTag(leagueId));
};

export const revalidateLeaguePremiumCache = (leagueId: string) =>
  revalidateTag(getLeaguePremiumTag(leagueId));
