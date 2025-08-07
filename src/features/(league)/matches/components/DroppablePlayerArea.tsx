"use client";

import { useDroppable } from "@dnd-kit/core";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerType } from "@/drizzle/schema";
import { useId } from "react";

type Props = {
  player?: LineupPlayer;
  roleId?: number;
  lineupType: LineupPlayerType;
  children: React.ReactNode;
};

export default function DroppablePlayerArea({
  player,
  roleId,
  lineupType,
  children,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: useId(),
    data: {
      player,
      roleId,
      lineupType,
    },
  });

  return <div ref={setNodeRef}>{children}</div>;
}
