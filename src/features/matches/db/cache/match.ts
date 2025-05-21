import { getMatchTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type MATCH_TAG =
  | "match-starters-lineup"
  | "match-benchs-lineup"
  | "match-result";

export const getMatchStartersLineupTag = (matchId: string) =>
  getMatchTag("match-starters-lineup", matchId);

export const getMatchBenchsLineupTag = (matchId: string) =>
  getMatchTag("match-starters-lineup", matchId);

export const getMatchResultTag = (matchId: string) =>
  getMatchTag("match-result", matchId);

export const revalidateMatchLinuep = (matchId: string) => {
  revalidateTag(getMatchStartersLineupTag(matchId));
  revalidateTag(getMatchBenchsLineupTag(matchId));
};

export const revalidateMatchResultCache = (matchId: string) =>
  revalidateTag(getMatchResultTag(matchId));
