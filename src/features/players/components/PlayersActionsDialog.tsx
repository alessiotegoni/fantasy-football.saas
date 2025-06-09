"use client";

import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamsSelect } from "@/features/teams/components/TeamsSelect";
import useMultiPlayerSelection from "@/hooks/useMultiPlayerSelection";
import usePlayersList from "@/hooks/usePlayersList";

export default function PlayersActionsDialog({
  leagueId,
}: {
  leagueId: string;
}) {
    const { teams } = usePlayersList();

    const { selectedPlayerId, toggleSelectTeam } = useMultiPlayerSelection();
    if (!selectedPlayerId) return null;


  console.log(selectedPlayerId);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Aggiungi giocatore</DialogTitle>
        <DialogDescription>
          Aggiungi giocatore alla rosa di un membro della lega a tua scelta
        </DialogDescription>
      </DialogHeader>
      <TeamsSelect teams={teams} onSelect={toggleSelectTeam} />
      <DialogFooter className="*:p-2.5 *:px-4 *:rounded-xl">
        <DialogClose asChild>
          <Button variant="outline" className="w-fit">
            Chiudi
          </Button>
        </DialogClose>
        <ActionButton loadingText="Aggiungo giocatore" className="w-fit">
          Aggiungi giocatore
        </ActionButton>
      </DialogFooter>
    </DialogContent>
  );
}
