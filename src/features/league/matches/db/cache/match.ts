import { getMatchTag } from "@/cache/helpers";
import { getLeagueMatchesResultsTag } from "@/features/league/leagues/db/cache/league";
import { updateTag } from "next/cache";

export type MATCH_TAG = "match-info" | "match-lineups" | "matches-results";

export const getMatchInfoTag = (matchId: string) =>
  getMatchTag("match-info", matchId);

export const getMatchLineupsTag = (matchId: string) =>
  getMatchTag("match-lineups", matchId);

export const getMatchResultsTag = (matchId: string) =>
  getMatchTag("matches-results", matchId);

export const revalidateMatchLinuepsCache = (matchId: string) => {
  updateTag(getMatchInfoTag(matchId));
  updateTag(getMatchLineupsTag(matchId));
};

export const revalidateMatchResultsCache = (
  leagueId: string,
  matchesIds: string[]
) => {
  updateTag(getLeagueMatchesResultsTag(leagueId));
  matchesIds.map((matchId) => updateTag(getMatchResultsTag(matchId)));
};
