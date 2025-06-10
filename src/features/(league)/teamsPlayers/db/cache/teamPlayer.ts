import { getTeamTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TEAM_PLAYERS_TAG = "team-players";

export const getTeamPlayersTag = (teamId: string) =>
  getTeamTag("team-players", teamId);

export const revalidateTeamPlayersCache = (teamId: string) => {
  revalidateTag(getTeamPlayersTag(teamId));
};
