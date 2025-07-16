import { cn } from "@/lib/utils";
import { RolePosition } from "@/drizzle/schema";
import { LineupPlayer } from "../queries/match";
import PositionSlot from "./PositionSlot";

type Props = {
  role: RolePosition;
  players: LineupPlayer[];
  canEdit: boolean;
  className?: string;
};

export default function RoleGroup({
  role,
  players,
  canEdit,
  className,
}: Props) {
  return (
    <div className={cn("flex", className)}>
      {role.positionsIds.map((posId) => {
        const player = players.find((p) => p.positionId === posId);

        return (
          <PositionSlot
            key={posId}
            positionId={posId}
            player={player}
            canEdit={canEdit}
          />
        );
      })}
    </div>
  );
}
