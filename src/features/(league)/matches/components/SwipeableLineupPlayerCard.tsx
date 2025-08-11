"use client";

import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import { LineupPlayer } from "../queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import LineupPlayerCard from "./LineupPlayerCard";
import { Button } from "@/components/ui/button";
import { TrashSolid } from "iconoir-react";
import { useRef } from "react";

type Props = {
  player: LineupPlayer;
  canEditLineup: boolean;
};

export default function SwipeableLineupPlayerCard({
  player,
  canEditLineup,
}: Props) {
  const { removePlayerFromLineup } = useMyLineup();
  const triggeredRef = useRef(false);

  function handleSwipeProgress(progress: number) {
    if (!triggeredRef.current && progress >= 100) {
      triggeredRef.current = true;
      removePlayerFromLineup(player.id);
    }
    if (progress === 0) triggeredRef.current = false;
  }

  return (
    <SwipeableListItem
      trailingActions={<RemovePlayer playerId={player.id} />}
      onSwipeProgress={handleSwipeProgress}
    //   onSwipeEnd={handleSwipeEnd}
      className="p-3 sm:p-4 !pt-3 sm:!pt-3.5 first:!pt-1.5 !pb-0"
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

function RemovePlayer({ playerId }: { playerId: number }) {
  const { removePlayerFromLineup } = useMyLineup();

  return (
    <TrailingActions>
      <Button
        variant="destructive"
        className="rounded-none mt-2 p-0 justify-center !items-center !bg-destructive/100"
        asChild
      >
        <SwipeAction
          destructive={true}
          onClick={removePlayerFromLineup.bind(null, playerId)}
        >
          <div className="h-full flex items-center justify-center p-4">
            <TrashSolid className="size-5" />
          </div>
        </SwipeAction>
      </Button>
    </TrailingActions>
  );
}
