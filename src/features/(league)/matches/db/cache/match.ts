import { getMatchTag } from "@/cache/helpers";
import { getLeagueMatchesResultsTag } from "@/features/(league)/leagues/db/cache/league";
import { revalidateTag } from "next/cache";

export type MATCH_TAG =
  | "match-info"
  | "match-starters-lineup"
  | "match-benchs-lineup"
  | "match-results";

export const getMatchInfoTag = (matchId: string) =>
  getMatchTag("match-info", matchId);

export const getMatchStartersLineupTag = (matchId: string) =>
  getMatchTag("match-starters-lineup", matchId);

export const getMatchBenchsLineupTag = (matchId: string) =>
  getMatchTag("match-benchs-lineup", matchId);

export const getMatchResultsTag = (matchId: string) =>
  getMatchTag("match-results", matchId);

export const revalidateMatchLinuepsCache = (matchId: string) => {
  revalidateTag(getMatchStartersLineupTag(matchId));
  revalidateTag(getMatchBenchsLineupTag(matchId));
};

export const revalidateMatchResultsCache = (
  leagueId: string,
  matchesIds: string[]
) => {
  revalidateTag(getLeagueMatchesResultsTag(leagueId));
  matchesIds.map((matchId) => revalidateTag(getMatchResultsTag(matchId)));
};
