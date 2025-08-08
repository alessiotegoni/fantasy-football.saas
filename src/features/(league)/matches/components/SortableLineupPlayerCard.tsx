import { useSortable } from "@dnd-kit/sortable";
import LineupPlayerCard from "./LineupPlayerCard";

type Props = Omit<
  React.ComponentPropsWithoutRef<typeof LineupPlayerCard>,
  "className"
>;

export default function SortableLineupPlayerCard({ player, ...props }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
        player={player}
        className="p-0 w-full text-left text-xs"
        {...props}
      />
    </div>
  );
}
