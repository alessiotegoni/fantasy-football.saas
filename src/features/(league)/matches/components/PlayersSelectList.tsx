"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { getNextPositionId } from "../utils/match";
import { LineupPlayerType } from "@/drizzle/schema";

export default function PlayersSelectList({
  availablePlayers,
}: {
  availablePlayers: TeamPlayer[] | LineupPlayerWithoutVotes[];
}) {
  const {
    myLineup: { tacticalModule, starterPlayers, benchPlayers },
    playersDialog: { type, positionId, roleId },
    addStarterPlayer,
    addBenchPlayer,
    handleSetPlayersDialog,
  } = useMyLineup();

  function handleCloseDialog(open?: boolean) {
    const isLastPlayer = availablePlayers.length - 1 <= 0;
    handleSetPlayersDialog({ open: open ?? !isLastPlayer });
  }

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
    if (!tacticalModule || !positionId || !roleId) return;

    const isPositionOccupied = starterPlayers.some(
      (player) => player.positionId === positionId && player.role.id === roleId
    );
    const nextPositionId = getNextPositionId({
      positionId,
      starterPlayers,
      roleId,
      moduleLayout: tacticalModule.layout,
    });

    const playerPosId = !isPositionOccupied ? positionId : nextPositionId;
    if (!playerPosId) return;

    const [, id] = playerPosId.split("-");
    const positionOrder = parseInt(id);

    addStarterPlayer({
      ...newPlayer,
      positionOrder,
      positionId: playerPosId,
    });

    console.log(positionId, nextPositionId);

    handleCloseDialog(!!nextPositionId);
  }

  function handleAddBenchPlayer(
    newPlayer: TeamPlayer & { lineupPlayerType: LineupPlayerType }
  ) {
    const positionOrder = benchPlayers.length + 1;
    addBenchPlayer({ ...newPlayer, positionOrder });

    handleCloseDialog();
  }

  return availablePlayers.map((player) => (
    <PlayerCard
      key={player.id}
      className="cursor-pointer"
      showSelectButton={false}
      showPurchaseCost={false}
      onSelect={handleAddPlayer}
      canSelectCard
      {...player}
    />
  ));
}
