"use client";

import { Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nomination } from "../queries/auctionNomination";
import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client/supabase";
import { AuctionWithSettings } from "../queries/auction";
import { Bid } from "../queries/auctionBid";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
  currentNomination: Nomination | null;
};

export function AuctionBids({ auction, currentNomination }: Props) {
  // TODO: Here add bids realtime

  return (
    <div className="bg-card border rounded-lg h-full">
      <div className="p-6">
        <div className="text-center space-y-6">
          {isUserTurn ? (
            <>
              <div className="space-y-2">
                <Trophy className="h-8 w-8 mx-auto text-primary" />
                <h2 className="text-lg font-heading font-bold">
                  È IL TUO TURNO
                </h2>
                <p className="text-sm text-muted-foreground">
                  Seleziona un giocatore e chiamalo
                </p>
              </div>

              {selectedPlayer && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">{selectedPlayer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlayer.team}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button className="flex-1 max-w-32">Chiama</Button>
                    <Button variant="secondary" className="flex-1 max-w-32">
                      Assegna
                    </Button>
                  </div>
                </div>
              )}
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
                    {selectedPlayer?.name || "Nessun giocatore"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlayer?.team}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm">Offerta attuale:</span>
                    <span className="font-bold text-primary">
                      ${currentBid}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentBid((prev) => prev + 1)}
                  >
                    +1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentBid((prev) => prev + 5)}
                  >
                    +5
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentBid((prev) => prev + 10)}
                  >
                    +10
                  </Button>
                </div>

                <Button className="w-full">Rilancia</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function useCurrentBid(nominationId: string | null) {
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);

  const supabase = createClient();

  function getCurrentBid(): Bid {
    const { data } = supabase
      .from("auction_bids")
      .select()
      .eq("nomination_id", nominationId)
      .order("amount", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1);

    return data;
  }

  function subscribeBids() {
    const subscription = supabase
      .channel(`id:${nominationId}-nomination-bids`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_bids" },
        (payload) => {
          const bid =
            payload.eventType === "INSERT" ? getCurrentBid() : null;

          setCurrentBid(bid);
        }
      )
      .subscribe();

    return subscription;
  }

  useEffect(() => {
    if (!nominationId) return;

    const subscription = subscribeBids();

    return () => {
      subscription.unsubscribe();
    };
  }, [nominationId]);

  return { currentBid, setCurrentBid };
}
