"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

type Args = {
  defaultAuction: NonNullable<AuctionWithSettings>;
};

export default function useAuctionSettings({ defaultAuction }: Args) {
  const [auction, setAuction] = useState(defaultAuction);

  const [supabase] = useState(createClient);
  const auctionSubscriptionRef = useRef<RealtimeChannel | null>(null);
  const settingsSubscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getAuctionWithSettings() {
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
      return;
    }

    return { ...data, settings: data.settings[0] } as AuctionWithSettings;
  }

  async function handleSetAuction() {
    console.log("event received");

    const auction = await getAuctionWithSettings();
    if (auction) setAuction(auction);
  }

  function subscribeAuction() {
    const auctionSubscription = supabase
      .channel(`auction:${defaultAuction.id}-details`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${defaultAuction.id}`,
        },
        handleSetAuction
      )
      .subscribe();

    auctionSubscriptionRef.current = auctionSubscription;
  }

  function subscribeSettings() {
    const settingsSubscription = supabase
      .channel(`auction:${defaultAuction.id}-settings`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auction_settings",
          filter: `auction_id=eq.${defaultAuction.id}`,
        },
        handleSetAuction
      )
      .subscribe();

    settingsSubscriptionRef.current = settingsSubscription;
  }

  function unsubscribeAuction() {
    if (auctionSubscriptionRef.current) {
      auctionSubscriptionRef.current.unsubscribe();
      auctionSubscriptionRef.current = null;
    }
  }

  function unsubscribeSettings() {
    if (settingsSubscriptionRef.current) {
      settingsSubscriptionRef.current.unsubscribe();
      settingsSubscriptionRef.current = null;
    }
  }

  useEffect(() => {
    subscribeAuction();
    subscribeSettings();

    return () => {
      unsubscribeAuction();
      unsubscribeSettings();
    };
  }, [defaultAuction.id]);

  return { auction };
}
