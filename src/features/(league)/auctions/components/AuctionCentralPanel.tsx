"use client";

import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import EmptyState from "@/components/EmptyState";
import { Clock, CursorPointer, Pause } from "iconoir-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssignPlayer from "./AssignPlayer";
import AuctionInProgress from "./AuctionInProgress";
import useAcquisitionsRoleSlots from "@/hooks/useAcquisitionsRoleSlots";
import TerminateAuction from "./TerminateAuction";
import AuctionTerminated from "./AuctionTerminated";

export default function AuctionCentralPanel() {
  const { auction, isLeagueAdmin, assignPlayerMode } = useAuction();
  const { unfilledRolesIds } = useAcquisitionsRoleSlots();

  switch (auction.status) {
    case "waiting":
      return (
        <EmptyState
          icon={Clock}
          title="In attesa di partecipanti"
          description="L'asta sara attiva quando tutti i membri della lega ci entreranno, oppure l'admin la dichiarera come attiva"
          className="static translate-none !bg-muted/30 max-w-full"
        />
      );
    case "paused":
      return (
        <EmptyState
          icon={Pause}
          title="Asta in pausa"
          description="Potrai riprendere l'asta quando l'admin la dichiarera come attiva"
          className="static translate-none !bg-muted/30 max-w-full"
        />
      );
    case "ended":
      return <AuctionTerminated />;
  }

  if (unfilledRolesIds.length) {
    return (
      <div className="bg-card border rounded-3xl h-full p-4 sm:p-6 relative min-h-[300px] flex flex-col justify-center">
        <TerminateAuction />
      </div>
    );
  }

  if (assignPlayerMode) {
    return (
      <div className="bg-card border rounded-3xl h-full p-4 sm:p-6 relative min-h-[300px] flex flex-col justify-center">
        {isLeagueAdmin && <AssignPlayerModeButton />}
        <AssignPlayer />
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-3xl h-full p-4 sm:p-6 relative min-h-[300px] flex flex-col justify-between">
      {isLeagueAdmin && <AssignPlayerModeButton />}
      <AuctionInProgress />
    </div>
  );
}

function AssignPlayerModeButton() {
  const { assignPlayerMode, toggleAssignPlayerMode, currentNomination } =
    useAuction();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "absolute right-4 size-10 rounded-full border border-border",
            assignPlayerMode ? "bg-primary" : "bg-input/60",
            currentNomination ? "top-16" : "top-4"
          )}
          onClick={toggleAssignPlayerMode}
        >
          <CursorPointer className="size-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {!assignPlayerMode ? "Assegna giocatore" : "Non assegnare giocatore"}
      </TooltipContent>
    </Tooltip>
  );
}
