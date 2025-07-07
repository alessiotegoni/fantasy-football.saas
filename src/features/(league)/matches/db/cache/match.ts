import { getMatchTag } from "@/cache/helpers";
import { getLeagueMatchesResultsTag } from "@/features/(league)/leagues/db/cache/league";
import { revalidateTag } from "next/cache";

export type MATCH_TAG =
  | "match-starters-lineup"
  | "match-benchs-lineup"
  | "match-results";

export const getMatchStartersLineupTag = (matchId: string) =>
  getMatchTag("match-starters-lineup", matchId);

export const getMatchBenchsLineupTag = (matchId: string) =>
  getMatchTag("match-benchs-lineup", matchId);

export const getMatchResultTag = (matchId: string) =>
  getMatchTag("match-results", matchId);

export const revalidateMatchLinuep = (matchId: string) => {
  revalidateTag(getMatchStartersLineupTag(matchId));
  revalidateTag(getMatchBenchsLineupTag(matchId));
};

export const revalidateMatchResultsCache = (
  leagueId: string,
  matchesIds: string[]
) => {
  revalidateTag(getLeagueMatchesResultsTag(leagueId));
  matchesIds.map((matchId) => revalidateTag(getMatchResultTag(matchId)));
};
