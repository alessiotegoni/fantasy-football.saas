import { MultiplayerSelectionContext } from "@/contexts/MultiPlayerSelectionProvider";
import { useContext } from "react";

export default function useMultiPlayerSelection() {
  const ctx = useContext(MultiplayerSelectionContext);
  if (!ctx)
    throw new Error(
      "useMultiPlayerSelection must be used within MultiPlayerSelection provider"
    );
  return ctx;
}
