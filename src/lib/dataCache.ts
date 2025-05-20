export type CACHE_TAG =
  | "users"
  | "leagues"
  | "teams"
  | "matches"
  | "players"
  | "scores"
  | "subscriptions";

export const getGlobalTag = (tag: CACHE_TAG) => `global:${tag}` as const;

export const getIdTag = (tag: CACHE_TAG, id: string) =>
  `id:${id}-${tag}` as const;

export const getUserTag = (tag: CACHE_TAG, userId: string) =>
  `user:${userId}-${tag}` as const;

export const getLeagueTag = (tag: CACHE_TAG, leagueId: string) =>
  `league:${leagueId}-${tag}` as const;

export const getTeamTag = (tag: CACHE_TAG, teamId: string) =>
  `team:${teamId}-${tag}` as const;
