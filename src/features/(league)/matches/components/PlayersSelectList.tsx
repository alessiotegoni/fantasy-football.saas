"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import { useCallback } from "react";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";

export default function PlayersSelectList({
  players,
}: {
  players: TeamPlayer[] | LineupPlayerWithoutVotes[];
}) {
  const { addPlayerToLineup, handleSetPlayersDialog } = useMyLineup();

  const isLastPlayer = useCallback(
    ({ id: selectedPlayerId }: TeamPlayer) =>
      players.filter((player) => player.id !== selectedPlayerId).length <= 0,
    [players]
  );

  async function handleSelectPlayer(player: TeamPlayer) {
    if (isLastPlayer(player)) {
      handleSetPlayersDialog({ open: false });
    }
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
