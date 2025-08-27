"use client";

import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import NumberInput from "@/components/ui/number-input";
import NominatePlayerButton from "./NominatePlayerButton";
import EmptyState from "@/components/EmptyState";
import { Clock, Pause } from "iconoir-react";
import CurrentBid from "./CurrentBid";
import BidTurn from "./BidTurn";
import { cn } from "@/lib/utils";
import BidPlayerButtons from "./BidPlayerButtons";

export default function AuctionBids() {
  const {
    auction,
    canNominate,
    currentNomination,
    canBid,
    currentBid,
    bidAmount,
    handleSetBidAmount,
    userParticipant,
    turnParticipant,
    isLeagueAdmin,
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
      {(currentNomination || currentBid) && <CurrentBid />}
      {turnParticipant && !currentBid && !currentNomination && <BidTurn />}

      {(isMyTurn || canBid) && (
        <>
          <div className="flex justify-center">
            <NumberInput
              disabled={currentBid ? canBid : canNominate}
              value={bidAmount}
              onChange={handleSetBidAmount}
              min={currentBid ? bidAmount : 1}
              max={userParticipant?.credits}
            />
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

            {isMyTurn && currentBid ? (
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
