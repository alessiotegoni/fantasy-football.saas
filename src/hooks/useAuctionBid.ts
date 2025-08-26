import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client/supabase";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { RealtimeChannel } from "@supabase/supabase-js";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { validateBidCredits } from "@/features/(league)/auctions/utils/auctionBid";

type Args = {
  userParticipant: AuctionParticipant | undefined;
  currentNomination: CurrentNomination;
  defaultBid: CurrentBid;
};

export default function useAuctionBid({
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

  const canBid =
    userParticipant &&
    validateBidCredits({
      bidAmount,
      participantCredits: userParticipant.credits,
      slotsRemaining: 2,
    }).isValid;

  const handleSetBidAmount = useCallback(
    (amount: number) => {
      if (canBid) setBidAmount(amount);
    },
    [bidAmount]
  );

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
