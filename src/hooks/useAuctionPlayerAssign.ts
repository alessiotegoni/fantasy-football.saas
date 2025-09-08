import { AuctionParticipant } from "@/features/league/auctions/queries/auctionParticipant";
import { useState, useCallback } from "react";

export default function useAuctionPlayerAssign() {
  const [assignPlayerMode, setAssignPlayerMode] = useState(false);
  const [participantToAssign, setParticipantToAssign] =
    useState<AuctionParticipant | null>(null);
  const [playerCost, setPlayerCost] = useState<number>(1);

  const toggleAssignPlayerMode = useCallback(() => {
    const newPlayerMode = !assignPlayerMode;

    if (!newPlayerMode) {
      setParticipantToAssign(null);
      setPlayerCost(1);
    }

    setAssignPlayerMode(newPlayerMode);
  }, [assignPlayerMode]);

  const handleSetParticipantToAssign = useCallback(
    (participant: AuctionParticipant) => {
      const isParticipantAssigned = participantToAssign?.id === participant.id;

      const toAssign = isParticipantAssigned ? null : participant;
      const playerMode = isParticipantAssigned ? false : true;

      setAssignPlayerMode(playerMode);
      setParticipantToAssign(toAssign);
    },
    [participantToAssign]
  );
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
