import { getTeamTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export type TEAM_PLAYERS_TAG = "team-players" | "players-per-role-count";

export const getTeamPlayersTag = (teamId: string) =>
  getTeamTag("team-players", teamId);

export const getTeamPlayersPerRoleTag = (teamId: string) =>
  getTeamTag("players-per-role-count", teamId);

export const revalidateTeamPlayersCache = (teamId: string) => {
  updateTag(getTeamPlayersPerRoleTag(teamId));
  updateTag(getTeamPlayersTag(teamId));
};
