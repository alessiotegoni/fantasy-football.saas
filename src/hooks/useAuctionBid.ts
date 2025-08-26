import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client/supabase";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { RealtimeChannel } from "@supabase/supabase-js";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { validateBidCredits } from "@/features/(league)/auctions/utils/auctionBid";
import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { Player } from "@/features/players/queries/player";

type Args = {
  auction: NonNullable<AuctionWithSettings>;
  userParticipant: AuctionParticipant | undefined;
  currentNomination: CurrentNomination;
  defaultBid: CurrentBid;
};

export default function useAuctionBid({
  auction,
  userParticipant,
  currentNomination,
  defaultBid,
}: Args) {
  const [currentBid, setCurrentBid] = useState(defaultBid);

  const defaultBidAmount =
    currentBid?.amount || currentNomination?.initialPrice || 1;
  const [bidAmount, setBidAmount] = useState(defaultBidAmount);

  useEffect(() => {
    setBidAmount(defaultBidAmount);
  }, [currentBid]);

  const canBid = useMemo(() => {
    const hasValidCredits = validateBidCredits({
      bidAmount,
      participantCredits: userParticipant?.credits ?? 0,
      slotsRemaining: 2,
    }).isValid;
    const isValidAuction = auction.status === "active";
    const isValidPlayer = !!currentNomination?.player;

    return hasValidCredits && isValidAuction && isValidPlayer;
  }, [userParticipant, bidAmount, auction]);

  const handleSetBidAmount = useCallback(setBidAmount, []);

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

  return { currentBid, canBid, bidAmount, handleSetBidAmount };
}
