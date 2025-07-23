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

export function getNextAvailablePosition(
  starterPlayers: LineupPlayerWithoutVotes[],
  layout: RolePosition[],
  roleId: number
) {
  const role = layout.find((r) => r.roleId === roleId);
  if (!role) return null;

  for (const posId of role.positionsIds) {
    const occupied = starterPlayers.some((p) => p.positionId === posId);
    if (!occupied) {
      return {
        positionId: posId,
        positionOrder: parseInt(posId.split("-")[1], 10),
      };
    }
  }

  return null;
}

export function isValidPositionId(
  positionId: PositionId | null,
  roleId: number | null,
  moduleLayout: RolePosition[]
) {
  if (!positionId || !roleId) return false;

  const [position, id] = positionId.split("-");

  if (!positions.includes(position as Position)) return false;

  const layoutPosition = moduleLayout.find(
    (layout) => layout.roleId === roleId
  );
  if (!layoutPosition) return false;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return false;

  return parsedId > 0 && parsedId <= layoutPosition.count;
}

export function reorderBench(players: LineupPlayerWithoutVotes[]) {
  return players.map((p, i) => ({ ...p, positionOrder: i + 1 }));
}

export function groupLineupsPlayers<
  T extends LineupPlayer | LineupPlayerWithoutVotes
>(players: T[]) {
  return Object.groupBy(players, (player) => player.lineupPlayerType);
}
