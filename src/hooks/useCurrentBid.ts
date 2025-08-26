import { useEffect, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client/supabase";
import { Bid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useCurrentBid(nomination: CurrentNomination | null) {
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getCurrentBid(): Promise<Bid | null> {
    const { data, error } = await supabase
      .from("auction_bids")
      .select("*")
      .eq("nomination_id", nomination?.id)
      .order("amount", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Errore getCurrentBid:", error);
      return null;
    }

    return data;
  }

  function subscribeBids() {
    const subscription = supabase
      .channel(`id:${nomination!.id}-nomination-bids`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_bids" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const bid = await getCurrentBid();
            setCurrentBid(bid);
          }
        }
      )
      .subscribe();

    subscriptionRef.current = subscription;
  }

  function unsubscribeBids() {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  }

  useEffect(() => {
    if (!nomination) {
      unsubscribeBids();
      return;
    }

    subscribeBids();

    return () => unsubscribeBids();
  }, [nomination]);

  return { currentBid, setCurrentBid };
}
