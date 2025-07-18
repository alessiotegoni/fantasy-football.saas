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
  const { availablePlayers, dialogOpen, handleSetDialogOpen } =
    useMyLineup(players);

  if (isMobile) {
    return (
      <Drawer open={dialogOpen} onOpenChange={handleSetDialogOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Giocatori</DrawerTitle>
            <DrawerDescription>Seleziona il giocatore</DrawerDescription>
          </DrawerHeader>
          <div className="p-6 pt-2"></div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleSetDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giocatori</DialogTitle>
          <DialogDescription>Seleziona il giocatore</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
