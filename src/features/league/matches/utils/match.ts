import { RolePosition } from "@/drizzle/schema";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { LineupPlayer, MatchInfo } from "../queries/match";

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

export function getMyTeam(
  myTeamId: string | null,
  { homeTeam, awayTeam }: MatchInfo,
  lineupsPlayers: LineupPlayer[]
) {
  const myTeam = [homeTeam, awayTeam].find((team) => team?.id === myTeamId);
  if (!myTeam) return;

  const players = lineupsPlayers.filter(
    (player) => player.leagueTeamId === myTeam.id
  );

  return {
    ...myTeam,
    lineup: {
      ...myTeam.lineup,
      players,
    },
  };
}

export type MyTeam = ReturnType<typeof getMyTeam>;
