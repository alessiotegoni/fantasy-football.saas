import {
  Position,
  PositionId,
  positions,
  RolePosition,
} from "@/drizzle/schema";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { LineupPlayer, MatchInfo } from "../queries/match";
import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";

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
  myTeamId: string,
  { homeTeam, awayTeam }: MatchInfo,
  lineupsPlayers: LineupPlayer[]
) {
  const myTeam = [homeTeam, awayTeam].find((team) => team?.id === myTeamId);
  if (!myTeam) return undefined;

  const players = lineupsPlayers
    .filter((player) => player.leagueTeamId === myTeam.id)
    .map(({ vote, bonusMaluses, ...player }) => player);

  return {
    ...myTeam,
    lineup: {
      ...myTeam.lineup,
      players,
    },
  };
}

export type MyTeam = ReturnType<typeof getMyTeam>;

export function getPositionOrder(positionId: PositionId) {
  const [, id] = positionId.split("-");

  return parseInt(id);
}

export function isValidPositionId(
  positionId: PositionId,
  roleId: number,
  moduleLayout: RolePosition[]
) {
  const [position, id] = positionId.split("-");

  if (!positions.includes(position as Position)) return false;

  const positionSlot = moduleLayout.find((layout) => layout.roleId === roleId);
  if (!positionSlot) return false;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return false;

  return parsedId > 0 && parsedId <= positionSlot.count;
}

export function reorderBench(players: LineupPlayerWithoutVotes[]) {
  return players.map((p, i) => ({ ...p, positionOrder: i + 1 }));
}

export function groupLineupsPlayers<
  T extends LineupPlayer | LineupPlayerWithoutVotes
>(players: T[]) {
  return Object.groupBy(players, (player) => player.lineupPlayerType);
}
