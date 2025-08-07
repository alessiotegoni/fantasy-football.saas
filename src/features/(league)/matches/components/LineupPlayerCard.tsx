"use client";

import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerType } from "@/drizzle/schema";
import RemovePlayerButton from "./RemovePlayerButton";
import { useDraggable } from "@dnd-kit/core";
import DroppablePlayerArea from "./DroppablePlayerArea";
import { DragHandGesture } from "iconoir-react";
import { Button } from "@/components/ui/button";

type Props = {
  player: LineupPlayer;
  type: LineupPlayerType;
  className?: string;
  canEdit?: boolean;
};

// TODO: aggiungere il ruolo del giocatore (<PlayerRoleBadge />) insieme al team se non ci sono bonusMalus
// FIXME: UI LineupPlayerCard (verticale mobile, orizzontale desktop)
// FIXME: UI LineupPlayerCard

export default function LineupPlayerCard({
  player,
  type,
  className,
  canEdit = false,
}: Props) {
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
      },
    });

  const isStarter = type === "starter";

  return (
    <DroppablePlayerArea lineupType="starter" player={player}>
      <div
        ref={setNodeRef}
        style={{
          transform: `translate(${transform?.x ?? 0}px, ${
            transform?.y ?? 0
          }px)`,
        }}
      >
        <div
          className={cn(
            "relative flex items-center gap-2 p-2 rounded-md group",
            isStarter ? "flex-col text-center" : "flex-row",
            isDragging && "border border-primary",
            className
          )}
        >
          <Avatar
            imageUrl={player.avatarUrl}
            name={player.displayName}
            className={cn(isStarter ? "size-12" : "size-10")}
            renderFallback={() => null}
          />
          <div className={cn(isStarter ? "text-xs" : "text-xs")}>
            <p className="font-semibold">
              {player.displayName.split(" ").slice(1)}
            </p>
            {player.vote !== null && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">
                  Voto: {player.vote ?? "-"}
                </span>
                {player.bonusMaluses && player.bonusMaluses.length > 0 && (
                  <div className="flex gap-1">
                    {player.bonusMaluses.map((bm, index) => (
                      <div key={index} className="flex items-center">
                        {bm.imageUrl && <></>}
                        <span>{bm.count > 0 ? `+${bm.count}` : bm.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {player.totalVote !== null && (
              <p className="font-bold">Totale: {player.totalVote}</p>
            )}
          </div>
          {canEdit && <RemovePlayerButton playerId={player.id} />}
        </div>
        <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="icon"
          className="cursor-grab p-0 rounded-full w-full hover:bg-transparent"
        >
          <DragHandGesture className="size-6" />
        </Button>
      </div>
    </DroppablePlayerArea>
  );
}
