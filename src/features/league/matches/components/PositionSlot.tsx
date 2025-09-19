import { LineupPlayer } from "../queries/match";
import { PositionId } from "@/drizzle/schema";
import LineupPlayerCard from "./LineupPlayerCard";
import EditablePositionSlot from "./EditablePositionSlot";
import { UserXmark } from "iconoir-react";

type Props = {
  player: LineupPlayer | undefined;
  roleId: number;
  positionId: PositionId;
  canEdit: boolean;
};

export default function PositionSlot({ player, canEdit, ...ids }: Props) {
  if (player && !canEdit) {
    return (
      <LineupPlayerCard
        type="starter"
        player={player}
        className="size-14 sm:size-16 xl:size-18 flex items-center justify-center"
        canEdit={false}
      />
    );
  }

  if (!player && !canEdit) return <LineupPlayerPlaceholder />;

  if (canEdit) return <EditablePositionSlot player={player} {...ids} />;

  return null;
}

function LineupPlayerPlaceholder() {
  return (
    <div className="h-[72px]">
      <div className="size-12 bg-muted rounded-full grid place-content-center">
        <UserXmark />
      </div>
    </div>
  );
}
