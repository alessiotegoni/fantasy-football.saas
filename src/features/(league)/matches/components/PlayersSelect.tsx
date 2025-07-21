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
import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { LineupTeam } from "../utils/match";

type Props = {
  matchId: string;
  playersPromise: Promise<TeamPlayer[]>;
};

export default function PlayersSelect({ matchId, myTeam, playersPromise }: Props) {
  const isMobile = useIsMobile();

  const players = use(playersPromise);
  const {
    availablePlayers,
    playersDialog: { open, type },
    handleSetPlayersDialog,
  } = useMyLineup(players);

  console.log(availablePlayers);

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(open) => handleSetPlayersDialog({ open })}
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
            <PlayersList
              players={availablePlayers}
              myTeam={myTeam}
              matchId={matchId}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => handleSetPlayersDialog({ open })}
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
                <PlayersList
              players={availablePlayers}
              myTeam={myTeam}
              matchId={matchId}
            />
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

function PlayersList({
  matchId,
  myTeam,
  players,
}: {
  matchId: string;
  myTeam: LineupTeam;
  players: TeamPlayer[] | LineupPlayerWithoutVotes[];
}) {
  const { addPlayerToLineup, handleSetPlayersDialog } = useMyLineup();

  async function handleSelectPlayer(player: TeamPlayer) {
    addPlayerToLineup(player);
    handleSetPlayersDialog({ open: false });
  }

  return players.map((player) => (
    <PlayerCard
      {...player}
      showSelectButton={false}
      onSelect={handleSelectPlayer}
      className="cursor-pointer"
    />
  ));
}
