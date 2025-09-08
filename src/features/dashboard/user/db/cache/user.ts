import { getUserTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type USER_TAG =
  | "user-premium"
  | "user-email"
  | "user-leagues"
  | "user-league-team-id";

export const getUserPremiumTag = (userId: string) =>
  getUserTag("user-premium", userId);

export const getUserEmailTag = (userId: string) =>
  getUserTag("user-email", userId);

export const getUserLeaguesTag = (userId: string) =>
  getUserTag("user-leagues", userId);

export const getUserTeamTag = (userId: string) =>
  getUserTag("user-league-team-id", userId);

export const revalidateUserPremium = (userId: string) =>
  revalidateTag(getUserPremiumTag(userId));

export const revalidateUserLeagues = (userId: string) =>
  revalidateTag(getUserLeaguesTag(userId));

export const revalidateUserTeam = (userId: string) =>
  revalidateTag(getUserTeamTag(userId));
