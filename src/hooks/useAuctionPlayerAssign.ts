import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { useState, useCallback } from "react";

export default function useAuctionPlayerAssign() {
  const [assignPlayerMode, setAssignPlayerMode] = useState(false);
  const [participantToAssign, setParticipantToAssign] =
    useState<AuctionParticipant | null>(null);
  const [playerCost, setPlayerCost] = useState<number>(1);

  const toggleAssignPlayerMode = useCallback(() => {
    setAssignPlayerMode((prev) => !prev);
    setParticipantToAssign(null);
    setPlayerCost(1);
  }, []);

  const handleSetParticipantToAssign = useCallback(setParticipantToAssign, []);
  const handleSetPlayerCost = useCallback(setPlayerCost, []);

  return {
    assignPlayerMode,
    toggleAssignPlayerMode,
    participantToAssign,
    handleSetParticipantToAssign,
    playerCost,
    handleSetPlayerCost,
  };
}
