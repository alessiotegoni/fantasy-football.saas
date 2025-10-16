import { getLeagueTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export type LEAGUE_STANDING_TAG = "league-standing";

export const getLeagueStandingTag = (leagueId: string) =>
  getLeagueTag("league-standing", leagueId);

export const revalidateLeagueStandingCache = (leagueId: string) => {
  updateTag(getLeagueTag("league-standing", leagueId));
};
