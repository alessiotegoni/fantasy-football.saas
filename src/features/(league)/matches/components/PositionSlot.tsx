import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { LineupPlayer } from "../queries/match";
import { PositionId } from "@/drizzle/schema";

type Props = {
  positionId: PositionId;
  player: LineupPlayer | undefined;
  canEdit: boolean;
};

export default function PositionSlot({ positionId, player, canEdit }: Props) {
  //   const { setNodeRef } = useDroppable({
  //     id: positionId,
  //     data: {
  //       type: "starter-slot",
  //       positionId,
  //     },
  //   });

  return (
    <div
      // ref={setNodeRef}
      className="size-14 sm:size-16 xl:size-18 bg-muted border border-border rounded-2xl flex items-center justify-center"
    >
      {player ? (
        <>{player.playerId}</>
      ) : // <PlayerCard player={player} />
      canEdit ? (
        <button
          className="text-muted-foreground hover:text-primary"
          onClick={() => {}}
        >
          <Plus className="w-6 h-6" />
        </button>
      ) : null}
    </div>
  );
}
