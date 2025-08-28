"use client";

import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import NominatePlayerButton from "./NominatePlayerButton";
import EmptyState from "@/components/EmptyState";
import { Clock, CursorPointer, Pause } from "iconoir-react";
import CurrentBid from "./CurrentBid";
import BidTurn from "./BidTurn";
import { cn } from "@/lib/utils";
import BidPlayerButtons from "./BidPlayerButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssignPlayer from "./AssignPlayer";
import CustomBidAmountInput from "./CustomBidAmountInput";

export default function AuctionBids() {
  const {
    auction,
    currentNomination,
    canBid,
    currentBid,
    userParticipant,
    turnParticipant,
    isLeagueAdmin,
    assignPlayerMode,
    customBidMode,
    canNominate,
    bidAmount,
    handleSetBidAmount,
  } = useAuction();

  const isMyTurn = userParticipant?.isCurrent ?? false;


  switch (auction.status) {
    case "waiting":
      return (
        <EmptyState
          icon={Clock}
          title="In attesa di partecipanti"
          description="L'asta sara attiva quando tutti i membri della lega ci entreranno, oppure l'admin la dichiarera come attiva"
        />
      );
    case "paused":
      return (
        <EmptyState
          icon={Pause}
          title="Asta in pausa"
          description="Potrai riprendere l'asta quando l'admin la dichiarera come attiva"
        />
      );
    case "ended":
      return (
        <EmptyState
          icon={Pause}
          title="Asta terminata"
          description="Tutte le rose verranno importate automaticamente all'interno della lega"
        />
      );
  }

  return (
    <div className="bg-card border rounded-3xl h-full p-4 sm:p-6 relative min-h-[300px] flex flex-col justify-between">
      {isLeagueAdmin && <AssignPlayerModeButton />}

      {(currentNomination || currentBid) && <CurrentBid />}
      {turnParticipant && !currentBid && !currentNomination && <BidTurn />}

      {(isMyTurn || canBid) && (
        <>
          <div className="flex justify-center">
            {(userParticipant?.isCurrent || customBidMode) && (
              <CustomBidAmountInput
                containerClassName="mb-4"
                disabled={currentBid ? !canBid : !canNominate}
                value={bidAmount}
                onChange={handleSetBidAmount}
                min={currentBid ? bidAmount : 1}
                max={userParticipant?.credits}
              />
            )}
          </div>
          <div
            className={cn(
              "flex gap-3 justify-center",
              (currentBid || currentNomination) && "mt-4"
            )}
          >
            {/* {isLeagueAdmin && !currentBid && (
              <Button variant="destructive" className="flex-1 max-w-32">
                Assegna
              </Button>
            )} */}

            {isMyTurn && !currentBid ? (
              <NominatePlayerButton />
            ) : (
              <BidPlayerButtons />
            )}
          </div>
        </>
      )}
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
      <TooltipContent>Assegna giocatore</TooltipContent>
    </Tooltip>
  );
}
