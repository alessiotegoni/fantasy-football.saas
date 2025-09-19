import { Plus } from "lucide-react";
import { LineupPlayer } from "../queries/match";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import { PositionId } from "@/drizzle/schema";
import DroppablePlayerArea from "./DroppablePlayerArea";
import DraggableLineupPlayerCard from "./DraggableLineupPlayerCard";
import LineupPlayerCard from "./LineupPlayerCard";

type Props = {
  player: LineupPlayer | undefined;
  roleId: number;
  positionId: PositionId;
  canEdit: boolean;
};

export default function PositionSlot({ player, canEdit, ...ids }: Props) {
  if (!player && canEdit) {
    return (
      <DroppablePlayerArea lineupType="starter" {...ids}>
        <PlayersSelectTrigger
          lineupType="starter"
          className="size-14 sm:size-16 xl:size-18 bg-muted border border-border rounded-2xl"
          {...ids}
        >
          <Plus className="size-6" />
        </PlayersSelectTrigger>
      </DroppablePlayerArea>
    );
  }

  if (player && canEdit) {
    return (
      <DroppablePlayerArea lineupType="starter" player={player}>
        <DraggableLineupPlayerCard player={player} canEdit={true} />
      </DroppablePlayerArea>
    );
  }

  if (player && !canEdit) {
    return (
      <LineupPlayerCard
        type="starter"
        player={player}
        className="size-14 sm:size-16 xl:size-18 flex items-center justify-center"
        canEdit={false}
      />
    );
  }

  return null;
}
