import { revalidateTag } from "next/cache";
import { getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getLeagueGlobalTag } from "@/cache/global";

export type LEAGUE_TAG =
  | "league-options"
  | "league-members"
  | "league-members-teams"
  | "league-matches"
  | "league-matchdays-calculations"
  | "league-free-agents-players"
  | "league-players-list"
  | "league-standing"
  | "league-bans";

export const getLeagueLeagueTag = (leagueId: string) =>
  getLeagueTag("leagues", leagueId);

export const getLeagueOptionsTag = (leagueId: string) =>
  getLeagueTag("league-options", leagueId);

export const getLeagueMembersTag = (leagueId: string) =>
  getLeagueTag("league-members", leagueId);

export const getLeagueMembersTeamsTag = (leagueId: string) =>
  getLeagueTag("league-members-teams", leagueId);

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

export const revalidateLeagueCache = ({
  leagueId,
  visibility,
}: {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
}) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueLeagueTag(leagueId));
  revalidateTag(getLeagueOptionsTag(leagueId));
};
