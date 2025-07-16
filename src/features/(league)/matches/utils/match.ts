import { RolePosition } from "@/drizzle/schema";
import {
  getPlayerRolesTag,
  getPlayersTag,
  getTacticalModulesTag,
  getTeamsTag,
} from "@/cache/global";
import {
  getMatchInfoTag,
  getMatchResultsTag,
} from "@/features/(league)/matches/db/cache/match";
import { getLeagueOptionsTag } from "@/features/(league)/options/db/cache/leagueOption";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { LineupPlayer } from "../queries/match";
import { getPlayerMatchdayVoteTag } from "@/features/votes/db/cache/vote";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

export function formatTeamData(
  teamId: string | null,
  team: Pick<LeagueTeam, "name" | "imageUrl"> | null,
  lineups: {
    id: string;
    teamId: string;
    tacticalModule: { id: number; layout: RolePosition[]; name: string };
  }[]
) {
  const lineup = lineups.find((l) => l.teamId === teamId) ?? null;

  return {
    id: teamId,
    ...team,
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

export function getLineupsPlayersTags({
  currentMatchdayId,
  players,
}: {
  players: LineupPlayer[];
  currentMatchdayId: number;
}) {
  const tags = [getPlayersTag(), getPlayerRolesTag(), getTeamsTag()];

  const playersMatchdayVotesTags = players.map((player) =>
    getPlayerMatchdayVoteTag(player.playerId, currentMatchdayId)
  );

  return [...tags, ...playersMatchdayVotesTags];
}
