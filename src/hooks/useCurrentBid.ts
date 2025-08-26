import { useEffect, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client/supabase";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { RealtimeChannel } from "@supabase/supabase-js";

type Args = {
  currentNomination: CurrentNomination;
  defaultBid: CurrentBid;
};

export function useCurrentBid({ currentNomination, defaultBid }: Args) {
  const [currentBid, setCurrentBid] = useState(defaultBid);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getCurrentBid(): Promise<CurrentBid | null> {
    const { data, error } = await supabase
      .from("auction_bids")
      .select("*")
      .eq("nomination_id", currentNomination!.id)
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
      .channel(`id:${currentNomination!.id}-nomination-bids`)
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
    if (!currentNomination) {
      unsubscribeBids();
      return;
    }

    subscribeBids();

    return () => unsubscribeBids();
  }, [currentNomination]);

  return { currentBid };
}
