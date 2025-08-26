"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { Nomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { use, useEffect, useRef, useState } from "react";

type Args = {
  auction: NonNullable<AuctionWithSettings>;
  lastNominationPromise: Promise<Nomination>;
};

export default function useCurrentNomination({
  auction,
  lastNominationPromise,
}: Args) {
  const [currentNomination, setCurrentNomination] = useState<Nomination | null>(
    null
  );

  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  function handleSetNomination(eventType: "INSERT" | "UPDATE" | "DELETE") {
    if (eventType === "DELETE") {
      setCurrentNomination(null);
      return;
    }

    const lastNomination = use(lastNominationPromise);
    if (!lastNomination) {
      setCurrentNomination(null);
      return;
    }

    if (lastNomination.status === "sold") {
      setCurrentNomination(null);
      unsubscribeNominations();
      return;
    }

    setCurrentNomination(lastNomination);
  }

  function subscribeNominations() {
    const supabase = createClient();

    const subscription = supabase
      .channel(`id:${auction.id}-auction-nominations`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_nominations" },
        (payload) => handleSetNomination(payload.eventType)
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

  return { currentNomination, setCurrentNomination };
}
