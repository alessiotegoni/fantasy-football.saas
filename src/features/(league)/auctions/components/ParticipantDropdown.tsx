import { useAuction } from "@/contexts/AuctionProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AuctionParticipant } from "../queries/auctionParticipant";
import ActionButton from "@/components/ActionButton";
import {
  deleteParticipant,
  setAuctionTurn,
} from "../actions/auctionParticipant";

export default function ParticipantDropdown({
  participant,
}: {
  participant: AuctionParticipant;
}) {
  const { turnParticipant, userParticipant, toggleAssignPlayerMode } =
    useAuction();

  const canAssignTurn =
    participant.teamId && participant.id !== turnParticipant?.id;
  const canKick = participant.teamId && participant.id !== userParticipant?.id;

  return (
    <DropdownMenuContent className="w-56 space-y-1">
      <DropdownMenuItem asChild>
        <Button variant="ghost" onClick={toggleAssignPlayerMode}>
          Assegna giocatore
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <ActionButton
          variant="ghost"
          loadingText="Assegno turno"
          disabled={!canAssignTurn}
          action={setAuctionTurn.bind(null, {
            auctionId: participant.auctionId,
            teamId: participant.teamId!,
          })}
        >
          Assegna turno
        </ActionButton>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <ActionButton
          variant="ghost"
          loadingText="Cambio ordine"
          action={undefined} // TODO: Change order dialog with dnd sortable
        >
          Cambia ordine
        </ActionButton>
      </DropdownMenuItem>

      <ActionButton
        variant="destructive"
        loadingText="Espello"
        disabled={!canKick}
        action={deleteParticipant.bind(null, {
          auctionId: participant.auctionId,
          teamId: participant.teamId!,
        })}
        className="text-sm py-1.5 rounded-lg"
        requireAreYouSure
        areYouSureDescription="Il partecipante verra espulso solamente dall'asta e potra rientrare in un secondo momento"
      >
        Espelli partecipante
      </ActionButton>
    </DropdownMenuContent>
  );
}
