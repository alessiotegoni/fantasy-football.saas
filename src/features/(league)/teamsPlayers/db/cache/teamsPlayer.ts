import { getTeamTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TEAM_PLAYERS_TAG = "team-players" | "players-per-role-count";

export const getTeamPlayersTag = (teamId: string) =>
  getTeamTag("team-players", teamId);

export const getTeamPlayersPerRoleTag = (teamId: string) =>
  getTeamTag("players-per-role-count", teamId);

export const revalidateTeamPlayersCache = (teamId: string) => {
  revalidateTag(getTeamPlayersPerRoleTag(teamId));
  revalidateTag(getTeamPlayersTag(teamId));
};
