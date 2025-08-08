import { useSortable } from "@dnd-kit/sortable";
import LineupPlayerCard from "./LineupPlayerCard";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";

type Props = {
  player: LineupPlayer;
  canEdit: boolean;
};

export default function SortableLineupPlayerCard({ player, canEdit }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: player.positionOrder ?? 0,
    data: { player, roleId: null, positionId: null, lineupType: "bench" },
  });

  const style = {
    transform,
    transition,
  };

  console.log(style);

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <LineupPlayerCard
        type="bench"
        player={player}
        canEdit={canEdit}
        className={cn(
          "p-0 w-full text-left text-xs",
          isDragging && "cursor-grabbing"
        )}
      />
    </div>
  );
}
