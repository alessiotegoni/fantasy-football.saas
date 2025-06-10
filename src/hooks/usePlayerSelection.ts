import { PlayerSelectionContext } from "@/contexts/PlayerSelectionProvider";
import { useContext } from "react";

export default function usePlayerSelection() {
  const ctx = useContext(PlayerSelectionContext);
  if (!ctx)
    throw new Error(
      "usePlayerSelection must be used within PlayerSelection provider"
    );

  return ctx;
}
