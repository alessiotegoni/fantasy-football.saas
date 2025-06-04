import { getIdTag, getLeagueTag, getTeamTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TEAM_TAG = "league-teams" | "team-players" | "team-credits";

export const getLeagueTeamsTag = (leagueId: string) =>
  getLeagueTag("league-teams", leagueId);

export const getTeamIdTag = (teamId: string) =>
  getIdTag("league-teams", teamId);

export const getLeagueMemberTeamTag = (teamId: string) =>
  getTeamTag("league-teams", teamId);

export const getTeamCreditsTag = (teamId: string) =>
  getTeamTag("team-credits", teamId);

export const getTeamPlayersTag = (teamId: string) =>
  getTeamTag("team-players", teamId);

export const revalidateLeagueTeamsCache = ({
  teamId,
  leagueId,
}: {
  teamId: string;
  leagueId: string;
}) => {
  revalidateTag(getLeagueTeamsTag(leagueId));
  revalidateTag(getTeamCreditsTag(teamId));
  revalidateTag(getTeamIdTag(teamId));
};

export const revalidateTeamPlayersCache = (teamId: string) => {
  revalidateTag(getTeamPlayersTag(teamId));
};
