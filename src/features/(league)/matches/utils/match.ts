import { RolePosition } from "@/drizzle/schema";
import { getTacticalModulesTag } from "@/cache/global";
import {
  getMatchInfoTag,
  getMatchResultsTag,
} from "@/features/(league)/matches/db/cache/match";
import { getLeagueOptionsTag } from "@/features/(league)/options/db/cache/leagueOption";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";

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
  splitId,
}: {
  homeTeam: Team;
  awayTeam: Team;
  leagueId: string;
  matchId: string;
  splitId: number;
}) {
  const tags = [
    getMatchInfoTag(matchId),
    getMatchResultsTag(matchId),
    getTacticalModulesTag(),
    getLeagueOptionsTag(leagueId),
    getSplitMatchdaysIdTag(splitId),
  ];

  if (homeTeam) tags.push(getTeamIdTag(homeTeam.id));
  if (awayTeam) tags.push(getTeamIdTag(awayTeam.id));

  return tags;
}
