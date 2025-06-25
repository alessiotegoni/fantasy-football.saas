export function groupTradePlayers(
  players: { id: number; offeredByProposer: boolean }[]
) {
  return Object.groupBy(players, (player) =>
    player.offeredByProposer ? "proposed" : "requested"
  );
}
