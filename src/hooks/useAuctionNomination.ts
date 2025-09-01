"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { createClient } from "@/services/supabase/client/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useMemo, useRef, useState } from "react";

type Args = {
  selectedPlayer: TeamPlayer | null;
  participants: AuctionParticipant[];
  userParticipant: AuctionParticipant | undefined;
  auction: NonNullable<AuctionWithSettings>;
  toggleSelectPlayer: (player: null) => void;
  defaultNomination?: CurrentNomination;
};

export default function useAuctionNomination({
  selectedPlayer,
  participants,
  userParticipant,
  auction,
  defaultNomination = null,
  toggleSelectPlayer,
}: Args) {
  const [currentNomination, setCurrentNomination] = useState(defaultNomination);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getCurrentNomination(): Promise<CurrentNomination | null> {
    const { data, error } = await supabase
      .from("auction_nominations")
      .select(
        `
        id,
        auctionId:auction_id,
        playerId:player_id,
        nominatedBy:nominated_by,
        expiresAt:expires_at,
        status,
        initialPrice:initial_price,
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
      .order("expires_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Errore gettting current nomination:", error);
      return null;
    }

    return data as unknown as CurrentNomination;
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
      .channel(`auction:${auction.id}-nominations`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auction_nominations",
          filter: `auction_id=eq.${auction.id}`,
        },
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
  }, [auction.id]);

  const canNominate = useMemo(() => {
    const isValidAuction = auction.status === "active";
    const isValidPlayer = !!selectedPlayer;
    const hasCredits = !!userParticipant?.credits;

    return hasCredits && isValidAuction && isValidPlayer;
  }, [userParticipant, selectedPlayer, auction]);

  const currentNominationTeam = useMemo(
    () =>
      currentNomination
        ? participants.find((p) => p.team?.id === currentNomination.nominatedBy)
        : undefined,
    [currentNomination]
  );

  return { currentNomination, currentNominationTeam, canNominate };
}
