"use client";

import { Button } from "@/components/ui/button";
import useMultiPlayerSelection from "@/hooks/useMultiPlayerSelection";

export default function MultiPlayerSelectionButton() {
  const { isSelectionMode, startSelectionMode, stopSelectionMode } =
    useMultiPlayerSelection();

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
