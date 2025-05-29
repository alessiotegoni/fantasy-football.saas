import { getLeagueGlobalTag } from "@/cache/global";
import { getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getLeagueIdTag } from "@/features/leagues/db/cache/league";
import { revalidateTag } from "next/cache";

export type LEAGUE_OPTIONS_TAG =
  | "league-modules"
  | "league-player-per-role"
  | "league-options"
  | "league-general-options"
  | "league-roster-options"
  | "league-bonus-malus-options";

export const getLeagueModulesTag = (leagueId: string) =>
  getLeagueTag("league-modules", leagueId);

export const getLeaguePlayersPerRoleTag = (leagueId: string) =>
  getLeagueTag("league-player-per-role", leagueId);

export const getLeagueOptionsTag = (leagueId: string) =>
  getLeagueTag("league-options", leagueId);

export const getLeagueGeneralOptionsTag = (leagueId: string) =>
  getLeagueTag("league-general-options", leagueId);

export const getLeagueRosterOptionsTag = (leagueId: string) =>
  getLeagueTag("league-roster-options", leagueId);

export const getLeagueBonusMalusOptionsTag = (leagueId: string) =>
  getLeagueTag("league-bonus-malus-options", leagueId);

export const revalidateLeagueRosterOptionsCache = (leagueId: string) => {
  revalidateTag(getLeagueModulesTag(leagueId));
  revalidateTag(getLeaguePlayersPerRoleTag(leagueId));
};

export const revalidateLeagueOptionsCache = ({
  leagueId,
  visibility,
}: {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
}) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueIdTag(leagueId));
  revalidateTag(getLeagueOptionsTag(leagueId));
};
