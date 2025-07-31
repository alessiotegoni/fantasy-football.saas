import { getLeagueTag } from "@/cache/helpers";

export type LEAGUE_STANDING_TAG = "league-standing";

export const getLeagueStandingTag = (leagueId: string) =>
  getLeagueTag("league-standing", leagueId);

