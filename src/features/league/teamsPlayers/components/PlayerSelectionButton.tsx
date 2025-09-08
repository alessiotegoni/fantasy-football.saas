"use client";

import { Button } from "@/components/ui/button";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";

export default function PlayerSelectionButton() {
  const { filteredPlayers } = usePlayersFilters();

  const { isSelectionMode, startSelectionMode, stopSelectionMode } =
    usePlayerSelection();

  const toggleSelectionMode = () =>
    !isSelectionMode ? startSelectionMode() : stopSelectionMode();

  return (
    !!filteredPlayers.length && (
      <Button
        className="text-xs rounded-lg w-fit"
        size="sm"
        onClick={toggleSelectionMode}
      >
        {isSelectionMode
          ? "Rimuovi giocatori selezionati"
          : "Seleziona giocatori"}
      </Button>
    )
  );
}
