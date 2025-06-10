"use client";

import { Button } from "@/components/ui/button";
import usePlayerSelection from "@/hooks/usePlayerSelection";

export default function PlayerSelectionButton() {
  const { isSelectionMode, startSelectionMode, stopSelectionMode } =
    usePlayerSelection();

  const toggleSelectionMode = () =>
    !isSelectionMode ? startSelectionMode() : stopSelectionMode();

  return (
    <Button
      className="text-xs rounded-lg w-fit"
      size="sm"
      onClick={toggleSelectionMode}
    >
      {isSelectionMode ? "Rimuovi giocatori selezionati" : "Seleziona giocatori"}
    </Button>
  );
}
