import {
  PRESIDENT_ROLE_ID,
  PRESIDENT_SLOT,
  RolePosition,
  TacticalModule,
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

export function getPresident(
  players: LineupPlayer[] | LineupPlayerWithoutVotes[],
  teamId: string | null
) {
  const president = players.find(
    (player) =>
      player.role.id === PRESIDENT_ROLE_ID && player.leagueTeamId === teamId
  );

  return president;
}

export function findNextAvailablePositionId({
  starterPlayers,
  roleId,
  tacticalModule: { layout },
}: {
  roleId: number;
  starterPlayers: LineupPlayerWithoutVotes[];
  tacticalModule: TacticalModule;
}) {
  const positionSlot = [PRESIDENT_SLOT, ...layout].find(
    (layout) => layout.roleId === roleId
  );
  if (!positionSlot) return null;

  const occupiedPositions = new Set(
    starterPlayers.filter((p) => p.role.id === roleId).map((p) => p.positionId)
  );

  const nextAvailable = positionSlot.positionsIds.find(
    (posId) => !occupiedPositions.has(posId)
  );

  return nextAvailable ?? null;
}

export function reorderBench(players: LineupPlayerWithoutVotes[]) {
  return players.map((p, i) => ({ ...p, positionOrder: i + 1 }));
}
