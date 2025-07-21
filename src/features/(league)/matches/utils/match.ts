import { RolePosition } from "@/drizzle/schema";
import {
  getPlayerRolesTag,
  getPlayersTag,
  getTacticalModulesTag,
  getTeamsTag,
} from "@/cache/global";
import {
  getMatchInfoTag,
  getMatchLineupsTag,
  getMatchResultsTag,
} from "@/features/(league)/matches/db/cache/match";
import { getLeagueOptionsTag } from "@/features/(league)/options/db/cache/leagueOption";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { LineupPlayer[] } from "../queries/match";
import { getPlayerMatchdayVoteTag } from "@/features/votes/db/cache/vote";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

export function formatTeamData(
  teamId: string | null,
  teamData: Pick<LeagueTeam, "name" | "imageUrl"> | null,
  lineups: {
    id: string;
    teamId: string;
    tacticalModule: { id: number; layout: RolePosition[]; name: string };
  }[]
) {
  const lineup = lineups.find((l) => l.teamId === teamId) ?? null;

  return {
    id: teamId,
    name: teamData?.name ?? null,
    imageUrl: teamData?.imageUrl ?? null,
    lineup,
  };
}

export type LineupTeam = ReturnType<typeof formatTeamData>;

export function getMatchInfoTags({
  homeTeamId,
  awayTeamId,
  leagueId,
  matchId,
  splitMatchday,
}: {
  homeTeamId: string | null;
  awayTeamId: string | null;
  splitMatchday: {
    id: number;
  };
  leagueId: string;
  matchId: string;
}) {
  const tags = [
    getMatchInfoTag(matchId),
    getMatchResultsTag(matchId),
    getTacticalModulesTag(),
    getLeagueOptionsTag(leagueId),
    getSplitMatchdaysIdTag(splitMatchday.id),
  ];

  if (homeTeamId) tags.push(getTeamIdTag(homeTeamId));
  if (awayTeamId) tags.push(getTeamIdTag(awayTeamId));

  return tags;
}

export function getMatchLineupsTags({
  matchId,
  currentMatchdayId,
  players,
}: {
  matchId: string;
  players: LineupPlayer[];
  currentMatchdayId: number;
}) {
  const tags = [
    getMatchLineupsTag(matchId),
    getPlayersTag(),
    getPlayerRolesTag(),
    getTeamsTag(),
  ];

  const playersMatchdayVotesTags = players.map((player) =>
    getPlayerMatchdayVoteTag(player.id, currentMatchdayId)
  );

  return [...tags, ...playersMatchdayVotesTags];
}
