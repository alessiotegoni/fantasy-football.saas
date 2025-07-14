import { RolePosition } from "@/drizzle/schema";
import { LineupPlayer } from "../queries/match";

type Props = {
  role: RolePosition;
  players: LineupPlayer[];
  canEdit: boolean;
};

export default function RoleRow({ role, players, canEdit }: Props) {
  return (
    <div className="flex justify-center gap-4">
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
