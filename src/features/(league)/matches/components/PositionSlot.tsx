import { Plus } from "lucide-react";
import { LineupPlayer } from "../queries/match";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import useMyLineup from "@/hooks/useMyLineup";
import LineupPlayerCard from "./LineupPlayerCard";

type Props = {
  player: LineupPlayer | undefined;
  roleId: number;
  canEdit: boolean;
};

export default function PositionSlot({
  roleId,
  player,
  canEdit,
}: Props) {
  const { removePlayerFromLineup } = useMyLineup();
  if (!player && !canEdit) return null;

  return (
    <>
      {player && (
        <LineupPlayerCard
          player={player}
          type="starter"
          canEdit={canEdit}
          onRemove={removePlayerFromLineup}
          className="size-14 sm:size-16 xl:size-18 flex items-center justify-center"
        />
      )}
      {!player && canEdit && (
        <PlayersSelectTrigger
          roleId={roleId}
          lineupType="starter"
          className="size-14 sm:size-16 xl:size-18 bg-muted border border-border rounded-2xl flex items-center justify-center text-muted-foreground transition-colors hover:text-white cursor-pointer"
        >
          <Plus className="size-6" />
        </PlayersSelectTrigger>
      )}
    </>
  );
}
