"use client";
import { LineupPlayerType, PositionId } from "@/drizzle/schema";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import { getPositionOrder } from "@/features/(league)/matches/utils/LineupPlayers";
import useMyLineup from "@/hooks/useMyLineup";
import {
  Collision,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import LineupPlayerCard from "@/features/(league)/matches/components/LineupPlayerCard";

export default function MyLineupDndProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    addStarterPlayer,
    removePlayerFromLineup,
    switchPlayers,
    switchPlayerPosition,
    reorderBenchPlayers,
  } = useMyLineup();
  const [activePlayer, setActivePlayer] = useState<LineupPlayer | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const player = event.active.data.current?.player as LineupPlayer;
    if (player) {
      setActivePlayer(player);
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    setActivePlayer(null);

    const { active, over } = e;
    if (!over) return;

    const sourcePlayer: LineupPlayer = e.active.data.current?.player;
    if (!sourcePlayer) return;

    if (active.id !== over.id) {
      const targetPlayer = over.data.current?.player as LineupPlayer;

      if (
        [sourcePlayer, targetPlayer].every(
          (player) => player?.lineupPlayerType === "bench"
        )
      ) {
        reorderBenchPlayers(sourcePlayer.id, targetPlayer.id);
        return;
      }
    }

    if (e.over?.id === "remove-player") {
      removePlayerFromLineup(sourcePlayer.id);
      return;
    }

    if (!e.collisions?.length) return;

    const targetPlayer = getTargetPlayer(e.collisions, sourcePlayer);

    if (targetPlayer && sourcePlayer.id !== targetPlayer?.id) {
      switchPlayers(sourcePlayer, targetPlayer);
      return;
    }

    const closestPositionId = getClosestPositionId(e.collisions, sourcePlayer);
    console.log(closestPositionId);

    if (closestPositionId && sourcePlayer.lineupPlayerType === "bench") {
      movePlayerToStarter(sourcePlayer, closestPositionId);
    }

    if (closestPositionId && sourcePlayer.lineupPlayerType === "starter") {
      switchPlayerPosition(sourcePlayer, closestPositionId);
    }
  }

  function movePlayerToStarter(
    benchPlayer: LineupPlayer,
    positionId: PositionId
  ) {
    const newStarterPlayer = {
      ...benchPlayer,
      lineupPlayerType: "starter" as LineupPlayerType,
      positionOrder: getPositionOrder(positionId),
      positionId,
    };

    removePlayerFromLineup(benchPlayer.id);
    addStarterPlayer(newStarterPlayer);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      {activePlayer && (
        <DragOverlay>
          <LineupPlayerCard
            player={activePlayer}
            type={activePlayer.lineupPlayerType!}
            canEdit={true}
          />
        </DragOverlay>
      )}
    </DndContext>
  );
}

function getTargetPlayer(
  collisions: Collision[],
  sourcePlayer: LineupPlayer
): LineupPlayer | null {
  const rolePlayersCollisions = collisions.filter(
    (collision) =>
      collision.data?.droppableContainer.data.current.player?.role.id ===
      sourcePlayer.role.id
  );

  const closestRolePlayers = getClosestCollision(rolePlayersCollisions);

  return (
    closestRolePlayers?.data?.droppableContainer.data.current.player ?? null
  );
}

function getClosestPositionId(
  collisions: Collision[],
  sourcePlayer: LineupPlayer
): PositionId | null {
  const roleCollisions = collisions.filter(
    (collision) =>
      collision.data?.droppableContainer.data.current.roleId ===
      sourcePlayer.role.id
  );

  const roleCollision = getClosestCollision(roleCollisions);

  return (
    roleCollision?.data?.droppableContainer.data.current.positionId ?? null
  );
}

function getClosestCollision(collisions: Collision[]) {
  if (!collisions.length) return null;

  return collisions.reduce((prevCollision, currentCollision) =>
    prevCollision.data!.value <= currentCollision.data!.value
      ? prevCollision
      : currentCollision
  );
}
