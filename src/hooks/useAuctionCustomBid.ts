import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { useState, useCallback, useEffect } from "react";

type Props = {
  currentBid: CurrentBid;
  currentNomination: CurrentNomination;
};

export default function useAuctionCustomBid({
  currentBid,
  currentNomination,
}: Props) {
  const defaultAmount =
    (currentBid?.amount || currentNomination?.initialPrice || 0) + 1;

  const [customBidMode, setCustomBidMode] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState(defaultAmount);

  useEffect(() => {
    setCustomBidAmount(defaultAmount);
  }, [defaultAmount]);

  const toggleCustomBidMode = useCallback(
    () => setCustomBidMode((prev) => !prev),
    []
  );
  const handleSetCustomBidAmount = useCallback(setCustomBidAmount, []);

  return {
    customBidMode,
    customBidAmount,
    toggleCustomBidMode,
    handleSetCustomBidAmount,
  };
}
