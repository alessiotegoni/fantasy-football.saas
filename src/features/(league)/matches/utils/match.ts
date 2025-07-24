import { PositionId, PRESIDENT_ROLE_ID, RolePosition, TacticalModule } from "@/drizzle/schema";
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
  if (!myTeam) return;

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

export function getNextPositionId({
  currentPositionId,
  starterPlayers,
  roleId,
  tacticalModule: { layout }
}: {
  currentPositionId: PositionId;
  roleId: number;
  starterPlayers: LineupPlayerWithoutVotes[];
  tacticalModule: TacticalModule;
}) {
  const positionSlot = layout.find((layout) => layout.roleId === roleId);
  if (!positionSlot) return null;

  const starterRolePlayers = starterPlayers.filter(
    (player) => player.positionId && player.role.id === roleId
  );

  const playerPositionsIds = new Set([
    ...starterRolePlayers.map((player) => player.positionId),
    currentPositionId,
  ]);

  const freePositionsIds = positionSlot.positionsIds.filter(
    (posId) => !playerPositionsIds.has(posId)
  );
  console.log(freePositionsIds);

  if (!freePositionsIds.length) return null;

  return freePositionsIds[0];
}

export function reorderBench(players: LineupPlayerWithoutVotes[]) {
  return players.map((p, i) => ({ ...p, positionOrder: i + 1 }));
}

export function groupLineupsPlayers<
  T extends LineupPlayer | LineupPlayerWithoutVotes
>(players: T[]) {
  return Object.groupBy(players, (player) => player.lineupPlayerType);
}
