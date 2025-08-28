import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { useState, useCallback } from "react";

export default function useAuctionPlayerAssign() {
  const [assignPlayerMode, setAssignPlayerMode] = useState(false);
  const [participantToAssign, setParticipantToAssign] =
    useState<AuctionParticipant | null>(null);
  const [playerCost, setPlayerCost] = useState<number>(1);

  const toggleAssignPlayerMode = useCallback(
    (playerMode: boolean, toAssign: AuctionParticipant | null) => {
      setAssignPlayerMode(playerMode);
      setParticipantToAssign(toAssign);
      setPlayerCost(1);
    },
    []
  );

  const handleSetParticipantToAssign = useCallback(
    (participant: AuctionParticipant) => {
      const isParticipantAssigned = participantToAssign?.id === participant.id;

      const toAssign = isParticipantAssigned ? null : participant;
      const playerMode = isParticipantAssigned ? false : true;

      toggleAssignPlayerMode(playerMode, toAssign);
    },
    [participantToAssign]
  );
  const handleSetPlayerCost = useCallback(setPlayerCost, []);

  return {
    assignPlayerMode,
    participantToAssign,
    handleSetParticipantToAssign,
    playerCost,
    handleSetPlayerCost,
  };
}
