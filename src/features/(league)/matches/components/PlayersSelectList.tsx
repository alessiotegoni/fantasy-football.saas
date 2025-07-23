"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";

export default function PlayersSelectList({
  players,
}: {
  players: TeamPlayer[] | LineupPlayerWithoutVotes[];
}) {
  const {
    playersDialog: { positionId },
    addPlayerToLineup,
    handleSetPlayersDialog,
  } = useMyLineup();

  async function handleSelectPlayer(player: TeamPlayer) {
    const isLastPlayer = players.length - 1 <= 0;
    if (isLastPlayer) handleSetPlayersDialog({ open: false });

    addPlayerToLineup(player);
  }

  return players.map((player) => (
    <PlayerCard
      key={player.id}
      className="cursor-pointer"
      showSelectButton={false}
      onSelect={handleSelectPlayer}
      canSelectCard
      {...player}
    />
  ));
}
