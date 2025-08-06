import { getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type LEAGUE_CALENDAR_TAG =
  | "league-regular-calendar"
  | "league-final-phase-calendar";

export const getLeagueRegularCalendarTag = (leagueId: string) =>
  getLeagueTag("league-regular-calendar", leagueId);

export const getLeagueFinalPhaseCalendarTag = (leagueId: string) =>
  getLeagueTag("league-final-phase-calendar", leagueId);

export const revalidateLeagueCalendarsCache = (leagueId: string) => {
  revalidateTag(getLeagueRegularCalendarTag(leagueId));
  revalidateTag(getLeagueFinalPhaseCalendarTag(leagueId));
};
