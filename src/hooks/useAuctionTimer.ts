import { useState, useEffect } from 'react';

type UseAuctionTimerProps = {
  expiresAt: Date | null;
  onExpire?: () => void;
};

export function useAuctionTimer({ expiresAt, onExpire }: UseAuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(0);
      return;
    }

    const target = new Date(expiresAt).getTime();

    const initialDiff = target - Date.now();
    if (initialDiff > 0) {
      setTimeLeft(Math.ceil(initialDiff / 1000));
    } else {
      setTimeLeft(0);
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        onExpire?.();
      } else {
        setTimeLeft(Math.ceil(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return timeLeft;
}
