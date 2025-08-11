"use client";

import ActionButton from "@/components/ActionButton";
import useMyLineup from "@/hooks/useMyLineup";
import { saveLineup } from "../actions/match";
import { createError } from "@/lib/helpers";
import { useIsMobile } from "@/hooks/useMobile";
import { MatchLineupSchema } from "../schema/match";
import { LineupPlayer } from "../queries/match";

export default function SaveLineupButton({
  leagueId,
  matchId,
}: {
  leagueId: string;
  matchId: string;
}) {
  const isMobile = useIsMobile(640);

  const {
    myLineup: { id: lineupId, starterPlayers, benchPlayers, tacticalModule },
    isLineupDirty,
  } = useMyLineup();

  async function handleSaveLineup() {
    if (!tacticalModule) return createError("Nessun modulo tattico trovato");

    const lineupPlayers = mapLineupPlayers([
      ...starterPlayers,
      ...benchPlayers,
    ]);

    return saveLineup({
      lineupId,
      leagueId,
      matchId,
      lineupPlayers,
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

function mapLineupPlayers(
  players: LineupPlayer[]
): MatchLineupSchema["lineupPlayers"] {
  const mappedPlayers = players.map(
    ({ id, lineupPlayerType, positionId, positionOrder }) => ({
      id,
      lineupPlayerType: lineupPlayerType ?? "bench",
      positionId,
      positionOrder: positionOrder ?? 0,
    })
  );

  return mappedPlayers;
}
