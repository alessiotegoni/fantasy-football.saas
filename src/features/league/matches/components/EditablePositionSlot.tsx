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
};

export default function EditablePositionSlot({ player, ...ids }: Props) {
  const content = player ? (
    <DraggableLineupPlayerCard player={player} />
  ) : (
    <PlayersSelectTrigger
      lineupType="starter"
      className="size-14 sm:size-16 xl:size-18 bg-muted border border-border rounded-2xl"
      {...ids}
    >
      <Plus className="size-6" />
    </PlayersSelectTrigger>
  );

  return (
    <DroppablePlayerArea
      id={ids.positionId}
      lineupType="starter"
      player={player}
      {...ids}
    >
      {content}
    </DroppablePlayerArea>
  );
}
