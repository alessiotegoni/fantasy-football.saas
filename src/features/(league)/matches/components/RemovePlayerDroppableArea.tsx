import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DroppablePlayerArea from "./DroppablePlayerArea";

import { TrashSolid } from "iconoir-react";
import useMyLineup from "@/hooks/useMyLineup";

export default function RemovePlayerDroppableArea() {
  const {
    myLineup: { starterPlayers, benchPlayers },
  } = useMyLineup();

  const canShowArea = [...starterPlayers, benchPlayers].length;
  if (!canShowArea) return null;

  return (
    <DroppablePlayerArea id="remove-player">
      <Tooltip>
        <TooltipTrigger
          className="w-full bg-destructive/80 border border-destructive
          rounded-xl hidden 2xl:flex justify-center items-center
          gap-2 p-2.5"
        >
          <TrashSolid className="size-5" />
        </TooltipTrigger>
        <TooltipContent>
          Trascina qui un giocatore per rimuoverlo dalla formazione
        </TooltipContent>
      </Tooltip>
    </DroppablePlayerArea>
  );
}
