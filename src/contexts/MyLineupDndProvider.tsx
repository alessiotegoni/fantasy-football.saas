"use client";
import { PositionId } from "@/drizzle/schema";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import { getPositionOrder } from "@/features/(league)/matches/utils/LineupPlayers";
import useMyLineup from "@/hooks/useMyLineup";
import { Collision, DndContext, DragEndEvent } from "@dnd-kit/core";
import {} from "@dnd-kit/utilities";

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
  } = useMyLineup();

  function handleMovePlayer(e: DragEndEvent) {
    if (!e.collisions?.length) return;

    const sourcePlayer: LineupPlayer = e.active.data.current?.player;
    if (!sourcePlayer) return;

    if (e.over?.id === "remove-player") {
      removePlayerFromLineup(sourcePlayer.id);
      return;
    }

    const targetPlayer = getTargetPlayer(e.collisions, sourcePlayer);

    if (targetPlayer && sourcePlayer.id !== targetPlayer?.id) {
      switchPlayers(sourcePlayer, targetPlayer);
      return;
    }

    const closestPositionId = getClosestPositionId(e.collisions, sourcePlayer);

    if (closestPositionId && sourcePlayer.lineupPlayerType === "bench") {
      movePlayerToStarter({
        ...sourcePlayer,
        positionOrder: getPositionOrder(closestPositionId),
        positionId: closestPositionId,
      });
    }

    if (closestPositionId && sourcePlayer.lineupPlayerType === "starter") {
      switchPlayerPosition(sourcePlayer, closestPositionId);
    }
  }

  function movePlayerToStarter(benchPlayer: LineupPlayer) {
    removePlayerFromLineup(benchPlayer.id);
    addStarterPlayer(benchPlayer);
  }

  return <DndContext onDragEnd={handleMovePlayer}>{children}</DndContext>;
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
