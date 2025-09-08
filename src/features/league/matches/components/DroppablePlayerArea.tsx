"use client";

import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerType, PositionId } from "@/drizzle/schema";
import { useId } from "react";

type Props = DroppablePlayerArea & {
  children: React.ReactNode;
  className?: string;
};

export type DroppablePlayerArea = {
  id?: UniqueIdentifier;
  player?: LineupPlayer;
  roleId?: number;
  positionId?: PositionId;
  lineupType?: LineupPlayerType;
};

export default function DroppablePlayerArea({
  id,
  player,
  roleId,
  positionId,
  lineupType,
  children,
  className = "",
}: Props) {
  const { setNodeRef } = useDroppable({
    id: id ? id : player ? player.id : useId(),
    data: {
      player,
      roleId,
      positionId,
      lineupType,
    },
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
