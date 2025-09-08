import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LineupPlayerCard from "./LineupPlayerCard";
import { LineupPlayer } from "../queries/match";

type Props = {
  player: LineupPlayer;
  canEdit: boolean;
  className?: string;
};

export default function SortableLineupPlayerCard({
  player,
  canEdit,
  className = "",
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: player.id,
    data: { player, roleId: null, positionId: null, lineupType: "bench" },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        visibility: isDragging ? "hidden" : "visible",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className={className}
    >
      <LineupPlayerCard
        type="bench"
        player={player}
        canEdit={canEdit}
        className="p-0 w-full text-left text-xs"
      />
    </div>
  );
}
