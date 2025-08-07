"use client";

import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { findNextAvailablePositionId } from "../utils/match";
import ScrollArea from "@/components/ui/scroll-area";
import { LineupPlayer } from "../queries/match";
import { formatTeamPlayer } from "../utils/LineupPlayers";

export default function PlayersSelectList({
  availablePlayers,
}: {
  availablePlayers: LineupPlayer[];
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

    const newPlayer = formatTeamPlayer(player);

    const addPlayer =
      type === "starter" ? handleAddStarterPlayer : handleAddBenchPlayer;

    addPlayer(newPlayer);
  }

  function handleAddStarterPlayer(newPlayer: LineupPlayer) {
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

  function handleAddBenchPlayer(newPlayer: LineupPlayer) {
    const positionOrder = benchPlayers.length + 1;
    addBenchPlayer({ ...newPlayer, positionOrder });

    const isLastPlayer = availablePlayers.length - 1 <= 0;
    handleSetPlayersDialog({ open: !isLastPlayer });
  }

  return (
    <ScrollArea className="max-h-[40dvh] xl:max-h-96 md:mt-3">
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
