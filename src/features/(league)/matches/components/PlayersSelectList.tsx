"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import useMyLineup from "@/hooks/useMyLineup";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { getPositionId } from "../utils/match";

export default function PlayersSelectList({
  players,
}: {
  players: TeamPlayer[] | LineupPlayerWithoutVotes[];
}) {
  const {
    myLineup: { tacticalModule, starterPlayers, benchPlayers },
    playersDialog: { type, positionId, roleId },
    addStarterPlayer,
    addBenchPlayer,
    handleSetPlayersDialog,
  } = useMyLineup();

  function handleCloseDialog(open?: boolean) {
    const isLastPlayer = players.length - 1 <= 0;
    handleSetPlayersDialog({ open: open ?? isLastPlayer });
  }

  function handleAddPlayer(player: TeamPlayer) {
    if (!type || !tacticalModule) return;

    const newPlayer = {
      ...player,
      lineupPlayerType: type,
    };

    if (type === "starter") {
      const playerPosId = getPositionId({
        positionId,
        starterPlayers,
        roleId,
        moduleLayout: tacticalModule.layout,
      });
      if (!playerPosId) return handleCloseDialog(false);

      const [, id] = playerPosId.split("-");
      const positionOrder = parseInt(id);

      addStarterPlayer({
        ...newPlayer,
        positionOrder,
        positionId: playerPosId,
      });
    }

    if (type === "bench") {
      const positionOrder = benchPlayers.length + 1;
      addBenchPlayer({ ...newPlayer, positionOrder });
    }

    handleCloseDialog();
  }

  return players.map((player) => (
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
