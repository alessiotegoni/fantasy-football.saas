"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { ParticipantAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

type Args = {
  auction: NonNullable<AuctionWithSettings>;
  defaultAcquisitions?: ParticipantAcquisition[];
};

export default function useAuctionAcquisitions({
  auction,
  defaultAcquisitions = [],
}: Args) {
  const [acquisitions, setAcquisitions] = useState(defaultAcquisitions);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getAcquisitions(): Promise<ParticipantAcquisition[]> {
    const { data, error } = await supabase
      .from("auction_acquisitions")
      .select(
        `
        id,
        auctionId:auction_id,
        participantId:participant_id,
        playerId:player_id,
        price,
        acquiredAt:acquired_at,
        player:players(
          id,
          displayName:display_name,
          roleId:role_id,
          team:teams(
            displayName:display_name
          )
        )
      `
      )
      .eq("auction_id", auction.id)
      .order("acquired_at", { ascending: false });

    if (error) {
      console.error("Error getting auction acquisitions:", error);
      return [];
    }

    return data as unknown as ParticipantAcquisition[];
  }

  async function handleSetAcquisitions() {
    const newAcquisitions = await getAcquisitions();
    setAcquisitions(newAcquisitions);
  }

  function subscribeAcquisitions() {
    const subscription = supabase
      .channel(`auction:${auction.id}-acquisitions`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auction_acquisitions",
          filter: `auction_id=eq.${auction.id}`,
        },
        handleSetAcquisitions
      )
      .subscribe();

    subscriptionRef.current = subscription;
  }

  function unsubscribeAcquisitions() {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  }

  useEffect(() => {
    subscribeAcquisitions();

    return () => unsubscribeAcquisitions();
  }, [auction.id]);

  return { acquisitions };
}
