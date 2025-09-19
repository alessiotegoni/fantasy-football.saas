import { LineupPlayer } from "../queries/match";
import { PositionId } from "@/drizzle/schema";
import LineupPlayerCard from "./LineupPlayerCard";
import EditablePositionSlot from "./EditablePositionSlot";

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

 if (canEdit) return <EditablePositionSlot player={player} {...ids} />

 return null
}
