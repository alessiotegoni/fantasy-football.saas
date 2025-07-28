import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { CustomBonusMalus, LineupPlayerType } from "@/drizzle/schema";
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

export function calculateLineupTotalVote(
  players: LineupPlayer[],
  {
    homeTeamId,
    awayTeamId,
    isBye = false,
  }: { homeTeamId: string | null; awayTeamId: string | null; isBye?: boolean }
): { home: number | null; away: number | null } | null {
  if (isBye) return null;

  const homePlayers = players.filter(
    (player) => player.leagueTeamId === homeTeamId
  );
  const awayPlayers = players.filter(
    (player) => player.leagueTeamId === awayTeamId
  );

  if (!homePlayers.length && !awayPlayers.length) return null;

  const totalVotes = {
    home: calculateTeamTotalVote(homePlayers),
    away: calculateTeamTotalVote(awayPlayers),
  };

  return totalVotes;
}


export function groupLineupsPlayers<
  T extends LineupPlayer | LineupPlayerWithoutVotes
>(players: T[]) {
  return Object.groupBy(players, (player) => player.lineupPlayerType);
}
