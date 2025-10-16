import { getLeagueGlobalTag } from "@/cache/global";
import { getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getLeagueIdTag } from "@/features/league/leagues/db/cache/league";
import { updateTag } from "next/cache";

export type LEAGUE_SETTINGS_TAG =
  | "league-modules"
  | "league-player-per-role"
  | "league-settings"
  | "league-general-settings"
  | "league-roster-settings"
  | "league-bonus-malus-settings"
  | "league-calculation-settings"
  | "league-market-settings";

export const getLeagueModulesTag = (leagueId: string) =>
  getLeagueTag("league-modules", leagueId);

export const getLeaguePlayersPerRoleTag = (leagueId: string) =>
  getLeagueTag("league-player-per-role", leagueId);

export const getLeagueSettingsTag = (leagueId: string) =>
  getLeagueTag("league-settings", leagueId);

export const getLeagueGeneralSettingsTag = (leagueId: string) =>
  getLeagueTag("league-general-settings", leagueId);

export const getLeagueRosterSettingsTag = (leagueId: string) =>
  getLeagueTag("league-roster-settings", leagueId);

export const getLeagueCalculationSettingsTag = (leagueId: string) =>
  getLeagueTag("league-calculation-settings", leagueId);

export const getLeagueBonusMalusSettingsTag = (leagueId: string) =>
  getLeagueTag("league-bonus-malus-settings", leagueId);

export const getLeagueMarketSettingsTag = (leagueId: string) =>
  getLeagueTag("league-market-settings", leagueId);

export const revalidateLeagueRosterSettingsCache = (leagueId: string) => {
  updateTag(getLeagueModulesTag(leagueId));
  updateTag(getLeaguePlayersPerRoleTag(leagueId));
};

export const revalidateLeagueSettingsCache = ({
  leagueId,
  visibility,
}: {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
}) => {
  if (visibility === "public") updateTag(getLeagueGlobalTag());
  updateTag(getLeagueIdTag(leagueId));
  updateTag(getLeagueSettingsTag(leagueId));
};
