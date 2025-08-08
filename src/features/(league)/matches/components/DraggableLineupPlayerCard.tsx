import LineupPlayerCard from "./LineupPlayerCard";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DragHandGesture } from "iconoir-react";
import { LineupPlayer } from "../queries/match";

type Props = {
  player: LineupPlayer;
  canEdit: boolean;
};

export default function DraggableLineupPlayerCard({ player, canEdit }: Props) {
  const { attributes, listeners, transform, isDragging, setNodeRef } =
    useDraggable({
      id: player.id,
      attributes: {
        role: "div",
        roleDescription: "draggable player",
        tabIndex: player.positionOrder ?? 0,
      },
      data: {
        player,
        roleId: null,
        positionId: null,
        lineupType: "starter",
      },
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
      }}
      className={cn("group relative", isDragging && "z-50")}
    >
      <LineupPlayerCard
        type="starter"
        player={player}
        canEdit={canEdit}
        className={cn(
          "size-14 sm:size-16 xl:size-18 flex items-center justify-center",
          isDragging && "opacity-0 pointer-events-none"
        )}
      />
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
        size="icon"
        className={cn(
          "cursor-grab p-0 rounded-full w-full hover:bg-transparent",
          "absolute top-full",
          isDragging ? "flex cursor-grabbing" : "hidden group-hover:flex"
        )}
      >
        <DragHandGesture className="size-6" />
      </Button>
    </div>
  );
}
