import { LineupPlayer } from "../queries/match";
import { PositionId } from "@/drizzle/schema";
import LineupPlayerCard from "./LineupPlayerCard";
import EditablePositionSlot from "./EditablePositionSlot";

type Props = {
  player: LineupPlayer | undefined;
  isAway: boolean
  roleId: number;
  positionId: PositionId;
  canEdit: boolean;
};

export default function PositionSlot({ player, canEdit, isAway, ...ids }: Props) {
  if (player && !canEdit) {
    return (
      <LineupPlayerCard
        type="starter"
        player={player}
        className="size-14 sm:size-16 xl:size-18 flex items-center justify-center"
        canEdit={false}
        isAwayTeam={isAway}
      />
    );
  }

  if (!player && !canEdit) return <LineupPlayerPlaceholder />;

  if (canEdit) return <EditablePositionSlot player={player} {...ids} />;

  return null;
}

function LineupPlayerPlaceholder() {
  return (
    <div className={"my-2 sm:mt-0 sm:h-20"}>
      <img
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/players-avatars/player-placeholder-2.png"
        alt="player placeholder"
        className="size-12"
      />
    </div>
  );
}
