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
import { use, useEffect } from "react";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import { useIsMobile } from "@/hooks/useMobile";
import PlayersSelectList from "./PlayersDialogList";
import { findNextAvailablePositionId } from "../utils/match";

export default function PlayersDialog({
  playersPromise,
}: {
  playersPromise: Promise<TeamPlayer[]>;
}) {
  const isMobile = useIsMobile();

  const players = use(playersPromise);
  const {
    myLineup: { tacticalModule, starterPlayers },
    availablePlayers,
    playersDialog: { open, type, roleId },
    handleSetPlayersDialog,
  } = useMyLineup(players);

  useEffect(() => {
    if (!roleId || !tacticalModule) return;

    const nextAvailableSlot = findNextAvailablePositionId({
      starterPlayers,
      roleId,
      tacticalModule,
    });

    if (!nextAvailableSlot) handleSetPlayersDialog({ open: false });
  }, [starterPlayers]);

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(open) =>
          handleSetPlayersDialog({ open, type: open ? type : null })
        }
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            {availablePlayers.length ? (
              <>
                <DrawerTitle>Giocatori</DrawerTitle>
                <DrawerDescription>
                  Seleziona il giocatore{" "}
                  {type === "bench" ? "panchinaro" : "titolare"}
                </DrawerDescription>
              </>
            ) : (
              <>
                <DrawerTitle>Nessun giocatore disponibile</DrawerTitle>
                <DrawerDescription>
                  I giocatori che hai acquistato dovrebbero apparire qui, se non
                  ci sono contatta gli admin della lega per farteli aggiungere
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>
          <div className="p-6 pt-0 space-y-2">
            <PlayersSelectList availablePlayers={availablePlayers} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        handleSetPlayersDialog({ open, type: open ? type : null })
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {availablePlayers.length ? (
            <>
              <DialogTitle>Giocatori</DialogTitle>
              <DialogDescription>
                Seleziona il giocatore{" "}
                {type === "bench" ? "panchinaro" : "titolare"}
              </DialogDescription>
              <div className="mt-2 space-y-2">
                <PlayersSelectList availablePlayers={availablePlayers} />
              </div>
            </>
          ) : (
            <>
              <DialogTitle>Nessun giocatore disponibile</DialogTitle>
              <DialogDescription>
                I giocatori che hai acquistato dovrebbero apparire qui, se non
                ci sono contatta gli admin della lega per farteli aggiungere
              </DialogDescription>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
