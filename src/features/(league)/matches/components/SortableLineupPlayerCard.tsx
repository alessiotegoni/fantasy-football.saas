import { useSortable } from "@dnd-kit/sortable";
import LineupPlayerCard from "./LineupPlayerCard";

export default function SortableLineupPlayerCard(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof LineupPlayerCard>,
    "className"
  >
) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.player.id });

  const style = {
    transform,
    transition,
  };

  console.log(style);

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <LineupPlayerCard {...props} className="p-0 w-full text-left text-xs" />
    </div>
  );
}
