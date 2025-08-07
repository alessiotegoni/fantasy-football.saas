"use client";
import useMyLineup from "@/hooks/useMyLineup";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

export default function MyLineupDndProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { movePlayer } = useMyLineup();

  function handleMovePlayer(e: DragEndEvent) {
    console.log(e);
  }

  return <DndContext onDragEnd={handleMovePlayer}>{children}</DndContext>;
}
