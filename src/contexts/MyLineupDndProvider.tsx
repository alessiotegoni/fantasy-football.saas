"use client";
import { PositionId } from "@/drizzle/schema";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import { Collision, DndContext, DragEndEvent } from "@dnd-kit/core";

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

    console.log(e.collisions);
    const targetPlayer = getTargetPlayer(e.collisions, sourcePlayer);

    console.log(sourcePlayer, targetPlayer);

    //FIXME: switchPlayers not working

    if (targetPlayer && sourcePlayer.id !== targetPlayer?.id) {
      switchPlayers(sourcePlayer, targetPlayer);
      return;
    }

    const closestPositionId = getClosestPositionId(e.collisions, sourcePlayer);

    if (closestPositionId && sourcePlayer.lineupPlayerType === "bench") {
      moveToStarter({
        ...sourcePlayer,
        positionId: closestPositionId,
      });
    }
    if (closestPositionId && sourcePlayer.lineupPlayerType === "starter") {
      switchPlayerPosition(sourcePlayer, closestPositionId);
    }

    // FIXME: gestire il caso degli spostamenti da starter a bench (prima vedere sortablelist da aggiongere a BenchLineup)
  }

  function moveToStarter(benchPlayer: LineupPlayer) {
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
