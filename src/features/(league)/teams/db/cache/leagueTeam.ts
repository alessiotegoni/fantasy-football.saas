import { getIdTag, getLeagueTag, getTeamTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TEAM_TAG = "league-teams";

export const getLeagueTeamsTag = (leagueId: string) =>
  getLeagueTag("league-teams", leagueId);

export const getTeamIdTag = (teamId: string) =>
  getIdTag("league-teams", teamId);

export const getLeagueMemberTeamTag = (teamId: string) =>
  getTeamTag("league-teams", teamId);

export const revalidateLeagueTeamsCache = ({
  teamsIds,
  leagueId,
}: {
  teamsIds: string[];
  leagueId: string;
}) => {
  revalidateTag(getLeagueTeamsTag(leagueId));
  teamsIds.forEach((teamId) => revalidateTag(getTeamIdTag(teamId)));
};
