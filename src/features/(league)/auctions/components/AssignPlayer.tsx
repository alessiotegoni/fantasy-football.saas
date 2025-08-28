import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuction } from "@/contexts/AuctionProvider";
import { HandCash } from "iconoir-react";
import CustomBidAmountInput from "./CustomBidAmountInput";
import ActionButton from "@/components/ActionButton";
import { addAcquisitionPlayer } from "../actions/auctionAcquisition";
import { validateBidCredits } from "../utils/auctionBid";
import { calculateRemainingSlots } from "../utils/auctionParticipant";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AssignPlayer() {
  const {
    auction,
    selectedPlayer,
    participantToAssign,
    playerCost,
    handleSetPlayerCost,
    acquisitions,
  } = useAuction();

  function handleAssignPlayer() {
    return addAcquisitionPlayer({
      auctionId: auction.id,
      participantId: participantToAssign!.id,
      playerId: selectedPlayer!.id,
      price: playerCost,
    });
  }

  const canAssign = useMemo(() => {
    if (!participantToAssign || !selectedPlayer || playerCost <= 0)
      return false;

    const slotsRemaining = calculateRemainingSlots(
      acquisitions,
      participantToAssign,
      auction
    );

    if (!slotsRemaining) return false;

    const creditsValidations = validateBidCredits({
      participantCredits: participantToAssign.credits,
      bidAmount: playerCost,
      slotsRemaining,
    });

    return creditsValidations.isValid;
  }, [participantToAssign, selectedPlayer, playerCost, acquisitions]);

  return (
    <div className="flex flex-col justify-between items-center text-center gap-2 h-full">
      <div className="flex flex-col justify-center items-center gap-2">
        <HandCash className="size-10 text-primary" />
        <h2 className="font-bold text-lg">ASSEGNA GIOCATORE</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Per assegnare un giocatore, selezionalo dal menu a sinistra, scegli la
          squadra ed il prezzo.
        </p>
      </div>

      {selectedPlayer && (
        <p className="font-semibold">{selectedPlayer.displayName}</p>
      )}

      <div className="flex gap-4">
        <TeamsSelect />

        <CustomBidAmountInput
          value={playerCost}
          onChange={handleSetPlayerCost}
          max={participantToAssign?.credits}
          min={1}
          disabled={!selectedPlayer || !participantToAssign}
        />
      </div>

      <ActionButton
        className={cn("max-w-36", !canAssign && "cursor-not-allowed")}
        variant="destructive"
        loadingText="Assegno"
        disabled={!canAssign}
        action={canAssign ? handleAssignPlayer : undefined}
      >
        Assegna
      </ActionButton>
    </div>
  );
}

function TeamsSelect() {
  const { participants, participantToAssign, handleSetParticipantToAssign } =
    useAuction();

  function handleSelectTeam(teamId: string) {
    const participant = participants.find((p) => p.teamId === teamId) || null;
    handleSetParticipantToAssign(participant);
  }

  return (
    <Select
      onValueChange={handleSelectTeam}
      value={participantToAssign?.teamId ?? undefined}
    >
      <SelectTrigger className="w-[190px] !bg-input/100 cursor-pointer">
        <SelectValue placeholder="Seleziona squadra" />
      </SelectTrigger>
      <SelectContent>
        {participants
          .filter((p) => p.team !== null)
          .map((p) => (
            <SelectItem key={p.teamId} value={p.team!.id}>
              {p.team!.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
