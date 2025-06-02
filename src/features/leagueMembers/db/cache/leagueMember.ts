import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { getLeagueBansTag } from "@/features/leagues/db/cache/league";
import { getUserLeaguesTag } from "@/features/users/db/cache/user";
import { revalidateTag } from "next/cache";

export type LEAGUE_MEMBERS_TAG = "league-members" | "league-members-teams";

export const getMemberIdTag = (memberId: string) =>
  getIdTag("league-members", memberId);

export const getLeagueMembersTag = (leagueId: string) =>
  getLeagueTag("league-members", leagueId);

export const getLeagueMembersTeamsTag = (leagueId: string) =>
  getLeagueTag("league-members-teams", leagueId);

export const revalidateLeagueMembersCache = ({
  leagueId,
  userId,
}: {
  leagueId: string;
  userId: string;
}) => {
  revalidateTag(getMemberIdTag(leagueId));
  revalidateTag(getLeagueMembersTag(leagueId));
  revalidateTag(getUserLeaguesTag(userId));
  revalidateTag(getLeagueBansTag(leagueId));
};
