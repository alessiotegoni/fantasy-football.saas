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
} from "../utils/lineupPlayers";
import { PositionId, PRESIDENT_ROLE_ID } from "@/drizzle/schema";
import { useMemo } from "react";

export default function PlayersSelectList({
  availablePlayers,
}: {
  availablePlayers: LineupPlayer[];
}) {
  const {
    myLineup: { tacticalModule, starterPlayers },
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
      positionOrder: getPositionOrder(playerPositionId),
      positionId: playerPositionId,
    };

    addStarterPlayer(playerToAdd);
  }

  function handleAddBenchPlayer(newPlayer: LineupPlayer) {
    addBenchPlayer(newPlayer);

    const isLastPlayer = availablePlayers.length - 1 <= 0;
    handleSetPlayersDialog({ open: !isLastPlayer });
  }

  const groupedPlayers = useMemo(
    () =>
      Object.groupBy(availablePlayers, (player) =>
        player.lineupPlayerType === null ? "not-lined-up" : "lined-up"
      ),
    [availablePlayers]
  );

  return Object.entries(groupedPlayers).map(([playerStatus, players]) => (
    <div key={playerStatus} className="not-first:mt-3">
      {roleId !== PRESIDENT_ROLE_ID && (
        <h3 className="font-medium mb-2.5 md:mt-3">
          {playerStatus === "not-lined-up"
            ? "Non schiearati"
            : type === "bench"
            ? "Titolari"
            : "In panchina"}
        </h3>
      )}
      <ScrollArea className="max-h-[40dvh] xl:max-h-96">
        {players.map((player) => (
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
    </div>
  ));
}
