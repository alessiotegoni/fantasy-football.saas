import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client/supabase";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { RealtimeChannel } from "@supabase/supabase-js";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { validateBidCredits } from "@/features/(league)/auctions/utils/auctionBid";
import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { calculateRemainingSlots } from "@/features/(league)/auctions/utils/auctionParticipant";
import { ParticipantAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";

type Args = {
  auction: NonNullable<AuctionWithSettings>;
  participants: AuctionParticipant[];
  acquisitions: ParticipantAcquisition[];
  userParticipant: AuctionParticipant | undefined;
  currentNomination?: CurrentNomination;
  defaultBid?: CurrentBid;
};

export default function useAuctionBid({
  auction,
  participants,
  acquisitions,
  userParticipant,
  currentNomination = null,
  defaultBid = null,
}: Args) {
  const [currentBid, setCurrentBid] = useState(defaultBid);

  const defaultBidAmount =
    currentBid?.amount || currentNomination?.initialPrice || 1;
  const [bidAmount, setBidAmount] = useState(defaultBidAmount);

  useEffect(() => {
    setBidAmount(defaultBidAmount);
  }, [defaultBidAmount]);

  const handleSetBidAmount = useCallback(setBidAmount, []);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  async function getCurrentBid(): Promise<CurrentBid | null> {
    const { data, error } = await supabase
      .from("auction_bids")
      .select("id, nominationId:nomination_id, participantId:participant_id, amount, createdAt:created_at")
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

  async function handleSetCurrentBid() {
    const bid = await getCurrentBid();
    setCurrentBid(bid);
  }

  function subscribeBids() {
    const subscription = supabase
      .channel(`nomination:${currentNomination!.id}-bids`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "auction_bids",
          filter: `nomination_id=eq.${currentNomination!.id}`,
        },
        handleSetCurrentBid
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

  const canBid = useMemo(() => {
    const slotsRemaining = calculateRemainingSlots(
      acquisitions,
      userParticipant,
      auction
    );

    const hasValidCredits = validateBidCredits({
      bidAmount,
      participantCredits: userParticipant?.credits ?? 0,
      slotsRemaining,
    }).isValid;

    const isValidAuction = auction.status === "active";
    const isValidPlayer = !!currentNomination?.player;
    const isParticipant = !!userParticipant;

    return hasValidCredits && isValidAuction && isValidPlayer && isParticipant;
  }, [userParticipant, bidAmount, auction, acquisitions, currentNomination]);

  const currentBidTeam = useMemo(
    () =>
      currentBid
        ? participants.find((p) => p.id === currentBid.participantId)
        : undefined,
    [currentBid]
  );

  return { currentBid, currentBidTeam, canBid, bidAmount, handleSetBidAmount };
}
