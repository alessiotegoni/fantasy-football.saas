import { useAuction } from "@/contexts/AuctionProvider";
import { useState, useEffect } from "react";

export function useAuctionTimer() {
  const { currentNomination } = useAuction();

  const [timeLeft, setTimeLeft] = useState(0);

  const expiresAt = currentNomination?.expiresAt;

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();

    const initialDiff = target - Date.now();
    if (initialDiff > 0) {
      setTimeLeft(Math.ceil(initialDiff / 1000));
    } else {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.ceil(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return currentNomination ? timeLeft : undefined;
}
