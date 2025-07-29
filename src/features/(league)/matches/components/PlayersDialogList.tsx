"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { findNextAvailablePositionId } from "../utils/match";
import { LineupPlayerType } from "@/drizzle/schema";
import ScrollArea from "@/components/ui/scroll-area";

export default function PlayersDialogList({
  availablePlayers,
}: {
  availablePlayers: TeamPlayer[] | LineupPlayerWithoutVotes[];
}) {
  const {
    myLineup: { tacticalModule, starterPlayers, benchPlayers },
    playersDialog: { type, roleId },
    addStarterPlayer,
    addBenchPlayer,
    handleSetPlayersDialog,
  } = useMyLineup();

  function handleAddPlayer(player: TeamPlayer) {
    if (!type) return;

    const newPlayer = {
      ...player,
      lineupPlayerType: type,
    };

    const addPlayer =
      type === "starter" ? handleAddStarterPlayer : handleAddBenchPlayer;

    addPlayer(newPlayer);
  }

  function handleAddStarterPlayer(
    newPlayer: TeamPlayer & { lineupPlayerType: LineupPlayerType }
  ) {
    if (!tacticalModule || !roleId) return;

    const positionId = findNextAvailablePositionId({
      starterPlayers,
      roleId,
      tacticalModule,
    });

    if (!positionId) {
      handleSetPlayersDialog({ open: false });
      return;
    }

    const [, id] = positionId.split("-");
    const positionOrder = parseInt(id);

    const playerToAdd = {
      ...newPlayer,
      positionOrder,
      positionId,
    };

    addStarterPlayer(playerToAdd);
  }

  function handleAddBenchPlayer(
    newPlayer: TeamPlayer & { lineupPlayerType: LineupPlayerType }
  ) {
    const positionOrder = benchPlayers.length + 1;
    addBenchPlayer({ ...newPlayer, positionOrder });

    const isLastPlayer = availablePlayers.length - 1 <= 0;
    handleSetPlayersDialog({ open: !isLastPlayer });
  }

  return (
    <ScrollArea>
      {availablePlayers.map((player) => (
        <PlayerCard
          key={player.id}
          className="cursor-pointer"
          showSelectButton={false}
          showPurchaseCost={false}
          onSelect={handleAddPlayer}
          canSelectCard
          {...player}
        />
      ))}
    </ScrollArea>
  );
}
