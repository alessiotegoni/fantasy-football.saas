import { getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type LEAGUE_STANDING_TAG = "league-standing";

export const getLeagueStandingTag = (leagueId: string) =>
  getLeagueTag("league-standing", leagueId);

export const revalidateLeagueStandingCache = (leagueId: string) => {
  revalidateTag(getLeagueTag("league-standing", leagueId));
};
