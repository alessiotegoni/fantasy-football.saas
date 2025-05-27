import { LEAGUE_TAG } from "@/features/leagues/db/cache/league";
import { MATCH_TAG } from "@/features/matches/db/cache/match";
import { TEAM_TAG } from "@/features/teams/db/cache/team";
import { GLOBAL_TAG } from "./global";
import { USER_TAG } from "@/features/users/db/cache/user";
import { AUCTION_TAG } from "@/features/auctions/db/cache/auction";
import { LEAGUE_OPTIONS_TAG } from "@/features/leagueOptions/db/cache/option";

export type CACHE_TAG =
  | GLOBAL_TAG
  | USER_TAG
  | LEAGUE_TAG
  | LEAGUE_OPTIONS_TAG
  | AUCTION_TAG
  | TEAM_TAG
  | MATCH_TAG;

export const getGlobalTag = (tag: CACHE_TAG) => `global:${tag}` as const;

export const getIdTag = (tag: CACHE_TAG, id: string) =>
  `id:${id}-${tag}` as const;

export const getuserTag = (tag: CACHE_TAG, userId: string) =>
  `user:${userId}-${tag}` as const;

export const getLeagueTag = (tag: CACHE_TAG, leagueId: string) =>
  `league:${leagueId}-${tag}` as const;

export const getTeamTag = (tag: CACHE_TAG, teamId: string) =>
  `team:${teamId}-${tag}` as const;

export const getMatchTag = (tag: CACHE_TAG, matchId: string) =>
  `match:${matchId}-${tag}` as const;
