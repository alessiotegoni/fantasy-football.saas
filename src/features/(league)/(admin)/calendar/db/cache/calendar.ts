import { getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type CALENDAR_TAG = "league-calendar";

export const getLeagueCalendarTag = (leagueId: string) =>
  getLeagueTag("league-calendar", leagueId);

export const revaidateLeagueCalendar = (leagueId: string) =>
  revalidateTag(getLeagueCalendarTag(leagueId));
