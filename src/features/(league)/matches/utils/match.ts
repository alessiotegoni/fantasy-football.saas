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

type Team = { id: string; name: string; imageUrl: string | null } | null;

export function formatTeamData(
  team: Team,
  lineups: {
    id: string;
    teamId: string;
    tacticalModule: { id: number; layout: RolePosition[]; name: string };
  }[]
) {
  if (!team) return null;

  const lineup = lineups.find((l) => l.teamId === team.id) ?? null;

  return {
    ...team,
    lineup,
  };
}

export type LineupTeam = ReturnType<typeof formatTeamData>;

export function getMatchInfoTags({
  homeTeam,
  awayTeam,
  leagueId,
  matchId,
  splitMatchday,
}: {
  homeTeam: Team;
  awayTeam: Team;
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

  if (homeTeam) tags.push(getTeamIdTag(homeTeam.id));
  if (awayTeam) tags.push(getTeamIdTag(awayTeam.id));

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
