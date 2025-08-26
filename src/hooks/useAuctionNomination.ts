"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

type Args = {
  auction: NonNullable<AuctionWithSettings>;
  defaultNomination: CurrentNomination;
  toggleSelectPlayer: (player: null) => void;
};

export default function useAuctionNomination({
  auction,
  defaultNomination,
  toggleSelectPlayer,
}: Args) {
  const [currentNomination, setCurrentNomination] = useState(defaultNomination);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getCurrentNomination(): Promise<CurrentNomination | null> {
    const { data, error } = await supabase
      .from("auction_nominations")
      .select("*, player:players(*, role:player_roles(*), team:teams(*))")
      .eq("auction_id", auction.id)
      .order("expires_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Errore gettting current nomination:", error);
      return null;
    }

    return data;
  }

  async function handleSetNomination() {
    const currentNomination = await getCurrentNomination();
    const nomination =
      currentNomination?.status === "bidding" ? currentNomination : null;

    if (!nomination || nomination.status === "sold") toggleSelectPlayer(null);

    setCurrentNomination(nomination);
  }

  function subscribeNominations() {
    const subscription = supabase
      .channel(`id:${auction.id}-auction-nominations`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_nominations" },
        handleSetNomination
      )
      .subscribe();

    subscriptionRef.current = subscription;
  }

  function unsubscribeNominations() {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  }

  useEffect(() => {
    subscribeNominations();

    return () => unsubscribeNominations();
  }, []);

  return { currentNomination };
}
