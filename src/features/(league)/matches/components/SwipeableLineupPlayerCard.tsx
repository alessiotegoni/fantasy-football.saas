"use client";

import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import { LineupPlayer } from "../queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import LineupPlayerCard from "./LineupPlayerCard";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Trash, TrashSolid } from "iconoir-react";

type Props = {
  player: LineupPlayer;
  canEditLineup: boolean;
};
export default function SwipeableLineupPlayerCard({
  player,
  canEditLineup,
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
    <SwipeableListItem
      leadingActions={leadingActions()}
      trailingActions={<RemovePlayerAction {...player} />}
      className="p-3 sm:p-4 !pt-3 sm:!pt-3.5 first:!pt-1.5 !pb-0"
      onSwipeEnd={console.log}
    >
      <LineupPlayerCard
        key={player.id}
        player={player}
        canEdit={canEditLineup}
        type="bench"
        className="p-0"
      />
    </SwipeableListItem>
  );
}

const leadingActions = () => (
  <LeadingActions>
    <SwipeAction onClick={() => console.info("Must be draggable")}>
      Must be draggable
    </SwipeAction>
  </LeadingActions>
);

function RemovePlayerAction({ id: playerId }: LineupPlayer) {
  const { removePlayerFromLineup } = useMyLineup();

  return (
    <TrailingActions>
      <Button
        variant="destructive"
        className="rounded-none mt-3 p-0 justify-center !items-center"
        asChild
      >
        <SwipeAction
        //   destructive={true}
          onClick={removePlayerFromLineup.bind(null, playerId)}
        >
          <TrashSolid className="size-5" />
        </SwipeAction>
      </Button>
    </TrailingActions>
  );
}
