import { Plus } from "lucide-react";
import { LineupPlayer } from "../queries/match";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import { PositionId } from "@/drizzle/schema";
import DroppablePlayerArea from "./DroppablePlayerArea";
import DraggableLineupPlayerCard from "./DraggableLineupPlayerCard";

type Props = {
  player: LineupPlayer | undefined;
  roleId: number;
  positionId: PositionId;
  canEdit: boolean;
};

export default function PositionSlot({ player, canEdit, ...ids }: Props) {
  if (!player && !canEdit) return null;

  return (
    <>
      {player && (
        <DroppablePlayerArea lineupType="starter" player={player}>
          <DraggableLineupPlayerCard player={player} canEdit={canEdit} />
        </DroppablePlayerArea>
      )}
      {!player && canEdit && (
        <DroppablePlayerArea lineupType="starter" {...ids}>
          <PlayersSelectTrigger
            lineupType="starter"
            className="size-14 sm:size-16 xl:size-18 bg-muted border border-border rounded-2xl"
            {...ids}
          >
            <Plus className="size-6" />
          </PlayersSelectTrigger>
        </DroppablePlayerArea>
      )}
    </>
  );
}
