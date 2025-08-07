"use client";

import ActionButton from "@/components/ActionButton";
import useMyLineup from "@/hooks/useMyLineup";
import { saveLineup } from "../actions/match";
import { createError } from "@/lib/helpers";
import { useIsMobile } from "@/hooks/useMobile";

export default function SaveLineupButton({
  leagueId,
  matchId,
}: {
  leagueId: string;
  matchId: string;
}) {
  const isMobile = useIsMobile();

  const {
    myLineup: { id: lineupId, starterPlayers, benchPlayers, tacticalModule },
    isLineupDirty,
  } = useMyLineup();

  console.log(tacticalModule);


  async function handleSaveLineup() {
    if (!tacticalModule) return createError("Nessun modulo tattico trovato");

    return saveLineup({
      lineupId,
      leagueId,
      matchId,
      lineupPlayers: [...starterPlayers, ...benchPlayers],
      tacticalModuleId: tacticalModule.id,
    });
  }

  return (
    isLineupDirty && (
      <ActionButton
        action={handleSaveLineup}
        loadingText={isMobile ? "Salvo formazione" : "Salvo"}
        className="mt-2 sm:mt-0 sm:w-32 sm:rounded-b-none hover:bg-primary h-[50px] sm:h-10
      sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:bottom-0 sm:z-50 xl:h-11 text-sm xl:text-base"
      >
        Salva
      </ActionButton>
    )
  );
}
