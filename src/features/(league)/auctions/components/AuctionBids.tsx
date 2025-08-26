"use client";

import { Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NominationWithPlayer } from "../queries/auctionNomination";
import { AuctionWithSettings } from "../queries/auction";
import { useCurrentBid } from "@/hooks/useCurrentBid";
import { useAuctionPlayer } from "@/contexts/AuctionPlayerProvider";
import ActionButton from "@/components/ActionButton";
import { createNomination } from "../actions/auctionNomination";
import { Input } from "@/components/ui/input";
import NumberInput from "@/components/ui/number-input";

type Props = {
  isAdmin: boolean;
  auction: NonNullable<AuctionWithSettings>;
  currentNomination: NominationWithPlayer | null;
};

export function AuctionBids({ auction, currentNomination, isAdmin }: Props) {
  const { selectedPlayer } = useAuctionPlayer();

  const { currentBid } = useCurrentBid(currentNomination);

  const player = currentNomination?.player || selectedPlayer;
  return (
    <div className="bg-card border rounded-3xl h-full">
      <div className="p-6">
        <div className="text-center space-y-6">
          {true ? (
            <>
              <div className="space-y-2">
                <Trophy className="h-8 w-8 mx-auto text-primary" />
                <h2 className="text-lg font-heading font-bold">
                  È IL TUO TURNO
                </h2>
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
                  <NumberInput defaultValue={1} min={1} />
                </div>

                <div className="flex gap-3 justify-center">
                  {isAdmin && (
                    <Button variant="destructive" className="flex-1 max-w-32">
                      Assegna
                    </Button>
                  )}
                  <ActionButton
                    className="flex-1 max-w-32"
                    loadingText="Chiamo"
                    action={
                      player
                        ? createNomination.bind(null, {
                            auctionId: auction.id,
                            initialPrice,
                            playerId: player.id,
                          })
                        : undefined
                    }
                  >
                    Chiama
                  </ActionButton>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Timer className="h-8 w-8 mx-auto text-primary" />
                <h2 className="text-lg font-heading font-bold">
                  ASTA IN CORSO
                </h2>
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
    </div>
  );
}
