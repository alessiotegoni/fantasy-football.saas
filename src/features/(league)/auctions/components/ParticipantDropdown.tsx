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
import ChangeOrderDialog from "./ChangeOrderDialog";
import { CursorPointer, UserXmark } from "iconoir-react";
import { SendToBack } from "lucide-react";

type ParticipantActionProps = {
  participant: AuctionParticipant;
};

export default function ParticipantDropdown({
  participant,
}: ParticipantActionProps) {
  return (
    <DropdownMenuContent className="w-56 space-y-1">
      <AssignPlayerButton participant={participant} />
      <SetTurnButton participant={participant} />
      <ChangeOrderDialog />
      <KickParticipantButton participant={participant} />
    </DropdownMenuContent>
  );
}

function AssignPlayerButton({ participant }: ParticipantActionProps) {
  const { auction, participantToAssign, handleSetParticipantToAssign } =
    useAuction();
  const canAssignPlayer = auction.status === "active";

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        onClick={handleSetParticipantToAssign.bind(null, participant)}
        className="w-full justify-start !px-2"
        disabled={!canAssignPlayer}
      >
        <CursorPointer />
        {participantToAssign?.id === participant.id
          ? "Non assegnare giocatore"
          : "Assegna giocatore"}
      </Button>
    </DropdownMenuItem>
  );
}

function SetTurnButton({ participant }: ParticipantActionProps) {
  const { turnParticipant } = useAuction();
  const canAssignTurn =
    participant.teamId && participant.id !== turnParticipant?.id;

  return (
    <ActionButton
      variant="ghost"
      loadingText="Assegno turno"
      disabled={!canAssignTurn}
      action={setAuctionTurn.bind(null, {
        auctionId: participant.auctionId,
        teamId: participant.teamId!,
      })}
      className="text-sm !px-2 py-1.5 rounded-lg w-full justify-start"
    >
      <SendToBack />
      Assegna turno
    </ActionButton>
  );
}

function KickParticipantButton({ participant }: ParticipantActionProps) {
  const { userParticipant } = useAuction();
  const canKick = participant.teamId && participant.id !== userParticipant?.id;

  return (
    <ActionButton
      variant="destructive"
      loadingText="Espello"
      disabled={!canKick}
      action={deleteParticipant.bind(null, {
        auctionId: participant.auctionId,
        teamId: participant.teamId!,
      })}
      className="text-sm px-2 py-1.5 rounded-lg w-full justify-start"
      requireAreYouSure
      areYouSureDescription="Il partecipante verra espulso solamente dall'asta e potra rientrare in un secondo momento"
    >
      <UserXmark />
      Espelli partecipante
    </ActionButton>
  );
}
