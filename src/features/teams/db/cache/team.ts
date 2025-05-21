import { getTeamTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TEAM_TAG = "team-players" | "team-credits"

export const getTeamPlayersTag = (teamId: string) =>
  getTeamTag("team-players", teamId);

export const getTeamCreditsTag = (teamId: string) =>
  getTeamTag("team-credits", teamId);

export const revalidateTeamCache = (teamId: string) => {
  revalidateTag(getTeamPlayersTag(teamId));
  revalidateTag(getTeamCreditsTag(teamId));
};
