"use client";

import { Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import NumberInput from "@/components/ui/number-input";
import { useEffect, useState } from "react";
import NominatePlayerButton from "./NominatePlayerButton";

export default function AuctionBids() {
  const {
    auction,
    selectedPlayer,
    currentNomination,
    currentBid,
    canBid,
    bidAmount,
    handleSetBidAmount,
    userParticipant,
    isLeagueAdmin,
  } = useAuction();

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const bidExpiresAt = currentNomination?.expiresAt;
    if (!bidExpiresAt) return;

    const target = new Date(bidExpiresAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentNomination?.expiresAt]);

  const player = currentNomination?.player || selectedPlayer;
  const isMyTurn = userParticipant?.isCurrent ?? false;

  return (
    <div className="bg-card border rounded-3xl h-full p-4 sm:p-6">
      <div className="text-center space-y-6">
        {isMyTurn ? (
          <>
            <div className="space-y-2">
              <Trophy className="size-8 mx-auto text-primary" />
              <h2 className="text-lg font-heading font-bold">È IL TUO TURNO</h2>
              <p className="text-sm text-muted-foreground">
                Seleziona un giocatore dal menu alla tua sinistra e chiamalo
              </p>
            </div>

            <div className="space-y-4">
              {player && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{player.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {player.team.name}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <NumberInput
                  disabled={!canBid}
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
                <NominatePlayerButton />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Timer className="h-8 w-8 mx-auto text-primary" />
              <h2 className="text-lg font-heading font-bold">ASTA IN CORSO</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {timeLeft}s
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">
                  {player?.displayName || "Nessun giocatore"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {player?.team.name}
                </p>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
