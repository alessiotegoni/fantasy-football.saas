"use client";

import { useDraggable } from "@dnd-kit/core";
import { LineupPlayer } from "../queries/match";

type Props = {
  player?: LineupPlayer;
  children: React.ReactNode;
};

export default function DroppablePlayerArea({ player, children }: Props) {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: player.id,
    attributes: {
      role: "div",
      roleDescription: "draggable player",
      tabIndex: player.positionOrder,
    },
    data: {
      player,
    },
  });

  return;
}
