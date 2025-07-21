"use client";

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import PositionSlot from "./PositionSlot";
import { LineupTeam } from "../utils/match";
import useMyLineup from "@/hooks/useMyLineup";
import { PositionId } from "@/drizzle/schema";

type Props = {
  team: NonNullable<LineupTeam>;
  players: LineupPlayer[];
  canEdit: boolean;
  className?: string;
};

export default function RoleGroup(props: Props) {
  const {
    myLineup: { tacticalModule },
  } = useMyLineup();

  const currentModule = props.canEdit
    ? tacticalModule
    : props.team.lineup!.tacticalModule;

  if (!currentModule) return null;

  return currentModule?.layout.map((role) => (
    <div className={cn("flex", props.className)} key={role.roleId}>
      {role.positionsIds.map((posId) => (
        <PositionsList
          key={posId}
          roleId={role.roleId}
          positionId={posId}
          {...props}
        />
      ))}
    </div>
  ));
}

function PositionsList(
  props: Omit<Props, "className"> & { roleId: number; positionId: PositionId }
) {
  const player = props.players.find((p) => p.positionId === props.positionId);

  return <PositionSlot player={player} {...props} />;
}
