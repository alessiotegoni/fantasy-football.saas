import { Plus } from "lucide-react";
import { LineupPlayer } from "../queries/match";
import { PositionId } from "@/drizzle/schema";
import PlayersSelectTrigger from "./PlayersSelectTrigger";

type Props = {
  positionId: PositionId;
  player: LineupPlayer | undefined;
  canEdit: boolean;
};

export default function PositionSlot({ positionId, player, canEdit }: Props) {
  if (!player && !canEdit) return null;

  return (
    <>
      {player && !canEdit && player.id}
      {player && canEdit && (
        <PlayersSelectTrigger lineupType="starter">
          {player.id}
        </PlayersSelectTrigger>
      )}
      {!player && canEdit && (
        <PlayersSelectTrigger
          lineupType="starter"
          className="size-14 sm:size-16 xl:size-18 bg-muted border border-border rounded-2xl flex items-center justify-center text-muted-foreground transition-colors hover:text-white cursor-pointer"
        >
          <Plus className="size-6" />
        </PlayersSelectTrigger>
      )}
    </>
  );
}
