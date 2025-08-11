import {
  CustomBonusMalus,
  PositionId,
  PRESIDENT_ROLE_ID,
  PRESIDENT_SLOT,
  TacticalModule,
} from "@/drizzle/schema";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import { PlayerBonusMalus } from "@/features/bonusMaluses/queries/bonusMalus";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";

type EnrichLineupPlayersParams = {
  lineupsPlayers: LineupPlayer[];
  playersBonusMaluses: PlayerBonusMalus[];
  leagueCustomBonusMalus: CustomBonusMalus;
};

export function enrichLineupPlayers({
  lineupsPlayers,
  playersBonusMaluses,
  leagueCustomBonusMalus,
}: EnrichLineupPlayersParams) {
  const playersBonusMalusesMap = new Map<number, PlayerBonusMalus[]>();
  for (const bonusMalus of playersBonusMaluses) {
    const playerBonusMaluses =
      playersBonusMalusesMap.get(bonusMalus.playerId) ?? [];
    playerBonusMaluses.push(bonusMalus);
    playersBonusMalusesMap.set(bonusMalus.playerId, playerBonusMaluses);
  }

  return lineupsPlayers.map((player) => {
    const playerBonusMaluses = playersBonusMalusesMap.get(player.id) ?? [];
    const totalVote = calculatePlayerTotalVote(
      player.vote,
      playerBonusMaluses,
      leagueCustomBonusMalus
    );

    return {
      ...player,
      bonusMaluses: playerBonusMaluses,
      totalVote,
    };
  });
}

export function calculatePlayerTotalVote(
  vote: string | null,
  bonusMaluses: PlayerBonusMalus[],
  leagueCustomBonusMalus: Record<string, number>
) {
  if (!vote) return null;

  return bonusMaluses.reduce((total, bonusMalus) => {
    const value = leagueCustomBonusMalus[bonusMalus.id];
    return total + value * bonusMalus.count;
  }, vote);
}

export function getPresident(players: LineupPlayer[], teamId: string | null) {
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
  starterPlayers: LineupPlayer[];
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

export function getPositionOrder(positionId: PositionId) {
  const [, id] = positionId.split("-");
  return parseInt(id);
}

export function formatTeamPlayer(
  player: TeamPlayer,
  data?: Partial<LineupPlayer>
): LineupPlayer {
  return {
    lineupPlayerType: null,
    vote: null,
    totalVote: null,
    positionId: null,
    positionOrder: null,
    bonusMaluses: [],
    ...player,
    ...data,
  };
}

export function groupLineupsPlayers(players: LineupPlayer[]) {
  return Object.groupBy(
    players,
    (player) => player.lineupPlayerType ?? "bench"
  );
}
