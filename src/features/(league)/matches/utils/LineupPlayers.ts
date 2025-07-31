import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import {
  CustomBonusMalus,
  RolePosition,
  TacticalModule,
} from "@/drizzle/schema";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import { PlayerBonusMalus } from "@/features/bonusMaluses/queries/bonusMalus";

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

export function calculateLineupsTotalVote(
  players: LineupPlayer[],
  {
    homeTeam,
    awayTeam,
    isBye = false,
  }: {
    homeTeam: { id: string | null; tacticalModule: TacticalModule | null };
    awayTeam: { id: string | null; tacticalModule: TacticalModule | null };
    isBye?: boolean;
  }
) {
  if (isBye || !players.length || (!homeTeam.id && !awayTeam.id)) return null;

  const playerWithVotes = players.filter((player) => player.totalVote !== null);

  const totalVotes = {
    home: calculateTeamTotalVote(playerWithVotes, homeTeam),
    away: calculateTeamTotalVote(playerWithVotes, awayTeam),
  };

  return totalVotes;
}

function calculateTeamTotalVote(
  players: LineupPlayer[],
  team: { id: string | null; tacticalModule: TacticalModule | null }
) {
  if (!team.tacticalModule) return null;

  const teamPlayers = players.filter(
    (player) => player.leagueTeamId === team.id
  );
  if (!teamPlayers.length) return null;

  const starterPlayers = teamPlayers.filter(
    (player) => player.lineupPlayerType === "starter"
  );

  const occupiedPositions = new Set(
    starterPlayers.map((player) => player.positionId)
  );

  const freeSlots = team.tacticalModule.layout.filter((slot) =>
    slot.positionsIds.some((positionId) => !occupiedPositions.has(positionId))
  );
  if (!freeSlots.length) return calculatePlayersTotalVote(starterPlayers);

  const benchPlayers = players.filter(
    (player) => player.lineupPlayerType === "bench"
  );
  if (!benchPlayers.length) return calculatePlayersTotalVote(starterPlayers);

  const newPlayers = replacePlayers(starterPlayers, benchPlayers, freeSlots);

  return calculatePlayersTotalVote(newPlayers);
}

function calculatePlayersTotalVote(players: { totalVote: string | null }[]) {
  const totalVote = players.reduce((acc, player) => {
    const totalVote = player.totalVote ? parseFloat(player.totalVote) : 0;

    return (acc += totalVote);
  }, 0);

  return totalVote.toString();
}

function replacePlayers(
  starterPlayers: LineupPlayer[],
  benchPlayers: LineupPlayer[],
  freeSlots: RolePosition[]
) {
  freeSlots.forEach((slot) => {
    const rolePlayers = benchPlayers.filter(
      (player) => player.role.id === slot.roleId
    );
    if (!rolePlayers.length) return;

    slot.positionsIds.forEach(() => {
      const [rolePlayer] = rolePlayers.splice(0, 1);
      if (!rolePlayer) return;

      starterPlayers.push(rolePlayer);
    });
  });

  return starterPlayers;
}

export function groupLineupsPlayers<
  T extends LineupPlayer | LineupPlayerWithoutVotes
>(players: T[]) {
  return Object.groupBy(players, (player) => player.lineupPlayerType);
}
