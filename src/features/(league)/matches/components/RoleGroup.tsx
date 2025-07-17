"use client";

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import PositionSlot from "./PositionSlot";
import { LineupTeam } from "../utils/match";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  team: NonNullable<LineupTeam>;
  players: LineupPlayer[];
  canEdit: boolean;
  className?: string;
};

export default function RoleGroup({
  team,
  players,
  canEdit,
  className,
}: Props) {
  const { tacticalModule: myTacticalModule } = useMyLineup();

  const tacticalModule = canEdit
    ? myTacticalModule
    : team.lineup!.tacticalModule;

  if (!tacticalModule) return null;

  return tacticalModule?.layout.map((role) => (
    <div className={cn("flex", className)} key={role.roleId}>
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
  ));
}
