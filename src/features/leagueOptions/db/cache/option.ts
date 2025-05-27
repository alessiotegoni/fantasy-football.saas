import { getLeagueGlobalTag } from "@/cache/global";
import { getLeagueTag } from "@/cache/helpers";
import { LeagueVisibilityStatusType } from "@/drizzle/schema";
import { revalidateTag } from "next/cache";

export type LEAGUE_OPTIONS_TAG =
  | "league-options"
  | "league-general-options"
  | "league-roster-options"
  | "league-bonus-malus-options";

export const getLeagueOptionsTag = (leagueId: string) =>
  getLeagueTag("league-options", leagueId);

export const getLeagueGeneralOptionsTag = (leagueId: string) =>
  getLeagueTag("league-options", leagueId);

export const getLeagueRosterOptionsTag = (leagueId: string) =>
  getLeagueTag("league-options", leagueId);

export const getLeagueBonusMalusOptionsTag = (leagueId: string) =>
  getLeagueTag("league-options", leagueId);

export const revalidateLeagueOptionsCache = ({
  leagueId,
  visibility,
}: {
  leagueId: string;
  visibility: LeagueVisibilityStatusType;
}) => {
  if (visibility === "public") revalidateTag(getLeagueGlobalTag());
  revalidateTag(getLeagueOptionsTag(leagueId));
};
