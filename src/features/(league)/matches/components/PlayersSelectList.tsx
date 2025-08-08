"use client";

import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import ScrollArea from "@/components/ui/scroll-area";
import { LineupPlayer } from "../queries/match";
import {
  findNextAvailablePositionId,
  formatTeamPlayer,
  getPositionOrder,
} from "../utils/LineupPlayers";
import { PositionId } from "@/drizzle/schema";

export default function PlayersSelectList({
  availablePlayers,
}: {
  availablePlayers: LineupPlayer[];
}) {
  const {
    myLineup: { tacticalModule, starterPlayers, benchPlayers },
    playersDialog: { type, roleId, positionId },
    addStarterPlayer,
    addBenchPlayer,
    handleSetPlayersDialog,
  } = useMyLineup();

  function handleAddPlayer(player: TeamPlayer) {
    if (!type) return;

    const newPlayer = formatTeamPlayer(player, { lineupPlayerType: type });

    const addPlayer =
      type === "starter" ? handleAddStarterPlayer : handleAddBenchPlayer;

    addPlayer(newPlayer);
  }

  function handleAddStarterPlayer(newPlayer: LineupPlayer) {
    if (!tacticalModule || !roleId || !positionId) return;

    let playerPositionId: PositionId | null = positionId;

    const isOccupied = starterPlayers.some(
      (player) => player.positionId === playerPositionId
    );

    if (isOccupied) {
      playerPositionId = findNextAvailablePositionId({
        starterPlayers,
        roleId,
        tacticalModule,
      });
    }

    if (!playerPositionId) {
      handleSetPlayersDialog({ open: false });
      return;
    }

    const playerToAdd = {
      ...newPlayer,
      positionOrder: getPositionOrder(positionId),
      positionId: playerPositionId,
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
