import { LEAGUE_TAG } from "@/features/(league)/leagues/db/cache/league";
import { MATCH_TAG } from "@/features/(league)/matches/db/cache/match";
import { GLOBAL_TAG } from "./global";
import { USER_TAG } from "@/features/users/db/cache/user";
import { AUCTION_TAG } from "@/features/(league)/auctions/db/cache/auction";
import { LEAGUE_OPTIONS_TAG } from "@/features/(league)/options/db/cache/leagueOption";
import { LEAGUE_MEMBERS_TAG } from "@/features/(league)/members/db/cache/leagueMember";
import { TEAM_PLAYERS_TAG } from "@/features/(league)/teamsPlayers/db/cache/teamsPlayer";
import { TEAM_TAG } from "@/features/(league)/teams/db/cache/leagueTeam";
import { TRADES_TAG } from "@/features/(league)/trades/db/cache/trade";
import { CALENDAR_TAG } from "@/features/(league)/(admin)/calendar/db/cache/calendar";
import { MATCHDAY_VOTE_TAG } from "@/features/votes/db/cache/vote";

export type CACHE_TAG =
  | GLOBAL_TAG
  | USER_TAG
  | LEAGUE_TAG
  | LEAGUE_OPTIONS_TAG
  | LEAGUE_MEMBERS_TAG
  | CALENDAR_TAG
  | TRADES_TAG
  | TEAM_TAG
  | TEAM_PLAYERS_TAG
  | MATCH_TAG
  | MATCHDAY_VOTE_TAG
  | AUCTION_TAG

export const getGlobalTag = (tag: CACHE_TAG) => `global:${tag}` as const;

export const getIdTag = (tag: CACHE_TAG, id: string) =>
  `id:${id}-${tag}` as const;

export const getUserTag = (tag: CACHE_TAG, userId: string) =>
  `user:${userId}-${tag}` as const;

export const getLeagueTag = (tag: CACHE_TAG, leagueId: string) =>
  `league:${leagueId}-${tag}` as const;

export const getTeamTag = (tag: CACHE_TAG, teamId: string) =>
  `team:${teamId}-${tag}` as const;

export const getMatchTag = (tag: CACHE_TAG, matchId: string) =>
  `match:${matchId}-${tag}` as const;
