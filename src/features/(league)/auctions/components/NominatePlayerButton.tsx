import ActionButton from "@/components/ActionButton";
import { useAuction } from "@/contexts/AuctionProvider";
import { createNomination } from "../actions/auctionNomination";

export default function NominatePlayerButton() {
  const { auction, canNominate, selectedPlayer, bidAmount } = useAuction();

  function handleCreateNomination() {
    return createNomination({
      auctionId: auction.id,
      initialPrice: bidAmount,
      playerId: selectedPlayer!.id,
    });
  }

  return (
    <ActionButton
      className="flex-1 max-w-32"
      loadingText="Chiamo"
      disabled={!canNominate}
      action={canNominate ? handleCreateNomination : undefined}
    >
      Chiama
    </ActionButton>
  );
}
