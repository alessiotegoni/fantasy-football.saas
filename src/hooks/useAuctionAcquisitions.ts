"use client";

import { AuctionAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

type Args = {
  auctionId: string;
  defaultAcquisitions:AuctionAcquisition[];
};

export default function useAuctionAcquisitions({
  auctionId,
  defaultAcquisitions,
}: Args) {
  const [acquisitions, setAcquisitions] = useState(defaultAcquisitions);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getAcquisitions(): Promise<
   AuctionAcquisition[]
  > {
    const { data, error } = await supabase
      .from("auction_acquisitions")
      .select(
        `
        id,
        auctionId:auction_id,
        teamId:team_id,
        playerId:player_id,
        price,
        player:players(
          id,
          displayName:display_name,
          roleId:role_id,
          team:teams(
            displayName:display_name
          )
        )
      `,
      )
      .eq("auction_id", auctionId);

    if (error) {
      console.error("Error getting auction acquisitions:", error);
      return [];
    }

    return data as unknown as AuctionAcquisition[];
  }

  async function handleSetAcquisitions() {
    const newAcquisitions = await getAcquisitions();
    setAcquisitions(newAcquisitions);
  }

  function subscribeAcquisitions() {
    const subscription = supabase
      .channel(`id:${auctionId}-auction-acquisitions`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_acquisitions" },
        handleSetAcquisitions,
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
  }, [auctionId]);

  return { acquisitions };
}
