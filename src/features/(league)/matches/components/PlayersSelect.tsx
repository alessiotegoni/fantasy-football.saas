"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { use } from "react";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import { useIsMobile } from "@/hooks/useMobile";

export default function PlayersSelect({
  playersPromise,
}: {
  playersPromise: Promise<TeamPlayer[]>;
}) {
  const isMobile = useIsMobile();

  const players = use(playersPromise);
  const {
    playersDialog: { open, type },
    handleSetPlayersDialog,
  } = useMyLineup(players);

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(open) => handleSetPlayersDialog({ type, open })}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Giocatori</DrawerTitle>
            <DrawerDescription>
              Seleziona il giocatore
              {type === "bench" ? "panchinaro" : "titolare"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 pt-2"></div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => handleSetPlayersDialog({ type, open })}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giocatori</DialogTitle>
          <DialogDescription>
            Seleziona il giocatore
            {type === "bench" ? "panchinaro" : "titolare"}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
