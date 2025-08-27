"use client";

import { Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import NumberInput from "@/components/ui/number-input";
import { useEffect, useState } from "react";
import NominatePlayerButton from "./NominatePlayerButton";
import EmptyState from "@/components/EmptyState";
import { Clock, Coins, Pause } from "iconoir-react";
import { Badge } from "@/components/ui/badge";
import BidPlayerButton from "./BidPlayerButton";
import CurrentBid from "./CurrentBid";

export default function AuctionBids() {
  const {
    auction,
    selectedPlayer,
    canNominate,
    currentNomination,
    canBid,
    currentBid,
    currentBidTeam,
    bidAmount,
    handleSetBidAmount,
    userParticipant,
    turnParticipant,
    isLeagueAdmin,
  } = useAuction();

  const player = currentNomination?.player || selectedPlayer;
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
      {!currentBid ? (
        <CurrentBid />
      ) : (
        <div className="space-y-2">
          <Trophy className="size-8 mx-auto text-primary" />
          {isMyTurn && (
            <>
              <h2 className="text-lg font-heading font-bold">È IL TUO TURNO</h2>
              <p className="text-sm text-muted-foreground">
                Seleziona un giocatore dal menu alla tua sinistra e chiamalo
              </p>
            </>
          )}
          {!isMyTurn && turnParticipant?.team && (
            <div className="flex flex-col justify-center items-center gap-2">
              <h2 className="text-lg font-heading font-bold">È IL TURNO DI</h2>
              <Badge className="p-2 px-4 rounded-lg bg-primary w-fit text-md font-semibold">
                {turnParticipant.team.name}
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {player && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{player.displayName}</p>
            <p className="text-sm text-muted-foreground">{player.team.name}</p>
          </div>
        )}

        <div className="flex justify-center">
          <NumberInput
            disabled={currentBid ? canBid : canNominate}
            value={bidAmount}
            onChange={handleSetBidAmount}
            min={bidAmount}
            max={userParticipant?.credits}
          />
        </div>

        <div className="flex gap-3 justify-center">
          {isLeagueAdmin && (
            <Button variant="destructive" className="flex-1 max-w-32">
              Assegna
            </Button>
          )}

          {isMyTurn && !currentBid ? (
            <NominatePlayerButton />
          ) : (
            <BidPlayerButton />
          )}
        </div>
      </div>
      {/*
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">
              {player?.displayName || "Nessun giocatore"}
            </p>
            <p className="text-sm text-muted-foreground">{player?.team.name}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm">Offerta attuale:</span>
              <span className="font-bold text-primary">
                ${currentBid?.amount}
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm">
            +1
          </Button>
        </div> */}
    </div>
  );
}
