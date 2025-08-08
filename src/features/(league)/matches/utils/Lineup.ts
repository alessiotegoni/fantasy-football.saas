import { RolePosition, TacticalModule } from "@/drizzle/schema";
import { LineupPlayer } from "../queries/match";

export function reorderBench(players: LineupPlayer[]) {
  return players.map((p, i) => ({ ...p, positionOrder: i + 1 }));
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
