"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

type Args = {
  auction: NonNullable<AuctionWithSettings>;
};

export default function useAuctionSettings({ auction: defaultAuction }: Args) {
  const [auction, setAuction] = useState(defaultAuction);

  const supabase = createClient();
  const auctionSubscriptionRef = useRef<RealtimeChannel | null>(null);
  const settingsSubscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getAuctionWithSettings(): Promise<AuctionWithSettings | undefined> {
    const { data, error } = await supabase
      .from("auctions")
      .select(
        `
        id,
        leagueId:league_id,
        splitId:split_id,
        name,
        description,
        type,
        createdBy:created_by,
        status,
        startedAt:started_at,
        endedAt:ended_at,
        settings:auction_settings(
            auctionId:auction_id,
            firstCallTime:first_call_time,
            othersCallsTime:others_calls_time,
            initialCredits:initial_credits,
            playersPerRole:players_per_role
        )
        `
      )
      .eq("id", defaultAuction.id)
      .single();

    if (error) {
      console.error("Error getting auction with settings:", error);
      return undefined;
    }

    const result = { ...data, settings: data.settings[0] };

    return result as unknown as AuctionWithSettings;
  }

  async function handleSetAuction() {
    const newAuction = await getAuctionWithSettings();
    if (newAuction) setAuction(newAuction);
  }

  function subscribeToChanges() {
    const auctionSubscription = supabase
      .channel(`auction:${defaultAuction.id}-details`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${defaultAuction.id}`,
        },
        handleSetAuction
      )
      .subscribe();
    auctionSubscriptionRef.current = auctionSubscription;

    const settingsSubscription = supabase
      .channel(`auction:${defaultAuction.id}-settings`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auction_settings",
          filter: `auction_id=eq.${defaultAuction.id}`,
        },
        handleSetAuction
      )
      .subscribe();
    settingsSubscriptionRef.current = settingsSubscription;
  }

  function unsubscribeFromChanges() {
    if (auctionSubscriptionRef.current) {
      auctionSubscriptionRef.current.unsubscribe();
      auctionSubscriptionRef.current = null;
    }
    if (settingsSubscriptionRef.current) {
      settingsSubscriptionRef.current.unsubscribe();
      settingsSubscriptionRef.current = null;
    }
  }

  useEffect(() => {
    subscribeToChanges();

    return () => unsubscribeFromChanges();
  }, [defaultAuction.id]);

  return { auction };
}
