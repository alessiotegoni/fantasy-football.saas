import { getLeagueTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export type LEAGUE_CALENDAR_TAG =
  | "league-regular-calendar"
  | "league-final-phase-calendar";

export const getLeagueRegularCalendarTag = (leagueId: string) =>
  getLeagueTag("league-regular-calendar", leagueId);

export const getLeagueFinalPhaseCalendarTag = (leagueId: string) =>
  getLeagueTag("league-final-phase-calendar", leagueId);

export const revalidateLeagueCalendarsCache = (leagueId: string) => {
  updateTag(getLeagueRegularCalendarTag(leagueId));
  updateTag(getLeagueFinalPhaseCalendarTag(leagueId));
};
