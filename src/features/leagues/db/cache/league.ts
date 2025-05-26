import { revalidateTag } from "next/cache";
import { getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getLeagueGlobalTag } from "@/cache/global";
import { getUserLeaguesTag } from "@/features/users/db/cache/user";

export type LEAGUE_TAG =
  | "league-info"
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

export const getLeagueInfoTag = (leagueId: string) =>
  getLeagueTag("league-info", leagueId);

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

type RevalidateLeagueArgs = {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
};

export const revalidateLeagueInfoCache = ({
  leagueId,
  visibility,
}: RevalidateLeagueArgs) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueInfoTag(leagueId));
};

export const revalidateLeagueOptionsCache = ({
  leagueId,
  visibility,
}: RevalidateLeagueArgs) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueOptionsTag(leagueId));
};

export const revalidateLeagueMembersCache = ({
  leagueId,
  userId,
}: {
  leagueId: string;
  userId: string;
}) => {
  revalidateTag(getLeagueMatchesTag(leagueId));
  revalidateTag(getUserLeaguesTag(userId));
};
