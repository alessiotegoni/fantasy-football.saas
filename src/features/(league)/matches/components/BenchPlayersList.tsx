import ScrollArea from "@/components/ui/scroll-area"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SwipeableList, SwipeableListItem } from "react-swipeable-list"
import { LineupPlayer } from "../queries/match";
import SortableLineupPlayerCard from "./SortableLineupPlayerCard";
import { cn } from "@/lib/utils";

type Props = {
  players: LineupPlayer[];
  canEditLineup: boolean;
};

export default function BenchPlayersList({ players, canEditLineup }: Props) {
  return <SortableContext
          items={players.map((player) => player.id)}
          strategy={verticalListSortingStrategy}
        >
          <ScrollArea
            className={cn(
              "space-y-3.5 max-h-[calc(500px-12px)] grow",
              players.length <= 8 && "p-0"
            )}
          >
            <SwipeableList>
              {players.map((player) => (
                <SwipeableListItem>
                  <SortableLineupPlayerCard
                    key={player.id}
                    player={player}
                    canEdit={canEditLineup}
                  />
                </SwipeableListItem>
              ))}
            </SwipeableList>
          </ScrollArea>
        </SortableContext>
}
