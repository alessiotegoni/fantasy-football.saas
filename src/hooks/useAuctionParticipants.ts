"use client";

import { AuctionWithSettings } from "@/features/league/auctions/queries/auction";
import { AuctionParticipant } from "@/features/league/auctions/queries/auctionParticipant";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type Args = {
  userTeamId?: string;
  auction: NonNullable<AuctionWithSettings>;
  defaultParticipants: AuctionParticipant[];
};

export default function useAuctionParticipants({
  userTeamId,
  auction,
  defaultParticipants,
}: Args) {
  const [participants, setParticipants] = useState(defaultParticipants);

  const router = useRouter();

  const [supabase] = useState(createClient);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getAuctionParticipants(): Promise<AuctionParticipant[]> {
    const { data, error } = await supabase
      .from("auction_participants")
      .select(
        "id, auctionId:auction_id, teamId:team_id, credits, order, isCurrent:is_current, joinedAt:joined_at, team:league_member_teams(id, name)"
      )
      .eq("auction_id", auction.id)
      .order("order", { ascending: true });

    if (error) {
      console.error("Error getting auction participants:", error);
      return [];
    }

    return data as unknown as AuctionParticipant[];
  }

  async function handleSetParticipants() {
    const newParticipants = await getAuctionParticipants();
    setParticipants(newParticipants);
  }

  function subscribeParticipants() {
    const subscription = supabase
      .channel(`auction:${auction.id}-participants`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auction_participants",
          filter: `auction_id=eq.${auction.id}`,
        },
        handleSetParticipants
      )
      .subscribe();

    subscriptionRef.current = subscription;
  }

  function unsubscribeParticipants() {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  }

  useEffect(() => {
    subscribeParticipants();

    return () => unsubscribeParticipants();
  }, [auction.id]);

  const userParticipant = useMemo(
    () =>
      userTeamId
        ? participants.find((p) => p.team?.id === userTeamId)
        : undefined,
    [participants]
  );

  const turnParticipant = useMemo(
    () => participants.find((p) => p.isCurrent),
    [participants]
  );

  useEffect(() => {
    if (userTeamId && !userParticipant) {
      toast.error("Sei stato espulso dall'asta");
      router.push(`/leagues/${auction.leagueId}/premium/auctions`);
    }
  }, [userParticipant]);

  return { participants, userParticipant, turnParticipant };
}
