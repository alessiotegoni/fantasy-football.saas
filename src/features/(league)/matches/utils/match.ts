import {
  LineupPlayerType,
  Position,
  PositionId,
  positions,
  PRESIDENT_ROLE_ID,
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

export function getPositionOrder(
  type: LineupPlayerType,
  positionId: PositionId | null,
  benchPlayers: LineupPlayerWithoutVotes[]
) {
  if (type === "starter") {
    if (!positionId) return null;

    const [, id] = positionId.split("-");

    return parseInt(id);
  } else return benchPlayers.length + 1;
}

export function getPositionId({
  type,
  positionId,
  starterPlayers,
  roleId,
  moduleLayout,
}: {
  type: LineupPlayerType;
  positionId: PositionId | null;
  roleId: number | null;
  starterPlayers: LineupPlayerWithoutVotes[];
  moduleLayout: RolePosition[];
}) {
  const positionSlot = moduleLayout.find((layout) => layout.roleId === roleId);

  if (
    type === "starter" &&
    Number.isInteger(roleId) &&
    positionSlot &&
    isValidPositionId(positionId, positionSlot)
  ) {
    const playerPositionsIds = new Set(
      starterPlayers
        .filter((player) => !!player.positionId && player.role.id === roleId)
        .map((player) => player.positionId)
    );

    const freePositionsIds = positionSlot.positionsIds.filter(
      (posId) => !playerPositionsIds.has(posId)
    );
    if (!freePositionsIds.length) return null;

    const isPositionFree = positionId && freePositionsIds.includes(positionId);

    return isPositionFree ? positionId : freePositionsIds[0];
  }

  return null;
}

export function isValidPositionId(
  positionId: PositionId | null,
  positionSlot: RolePosition
) {
  if (typeof positionId !== "string") return false;

  const [position, id] = positionId.split("-");
  if (!position || !id || !positions.includes(position as Position)) {
    return false;
  }

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
